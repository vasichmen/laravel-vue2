import {serialize} from 'object-to-formdata';
import Request from './Request';
import RequestBuilder from './RequestBuilder';
import Response from './Response';

const API_PREFIX = '/api/v1';

export default class BaseClient {
  _requestBuilder = null;
  _requests = new Map();
  _httpHandlers = new Map();
  _refreshTokenPromise = null;
  _refreshTokenErrorHandler = null;
  _refreshTokenAction = null;


  constructor() {
    this.init();
  }

  init() {
    this.initRequestBuilder();
  }

  initRequestBuilder() {
    this._requestBuilder = this.makeRequestBuilder();
    return this;
  }

  apiUrl(path) {
    return `${API_PREFIX}${path}`;
  }

  makeRequestBuilder() {
    return new RequestBuilder();
  }

  getRequestBuilder() {
    return this._requestBuilder;
  }

  pushRequest(request) {
    this._requests.set(request.getID(), request);
    return this;
  }

  removeRequest(request) {
    this._requests.delete(request.getID());
    return this;
  }

  removeRequestById(id) {
    this._requests.delete(id);
    return this;
  }

  cancelRequestById(id) {
    let request = this._requests.get(id);
    request.cancel();

    this.removeRequestById(id);
    return this;
  }

  clearAllRequests() {
    this._requests.forEach((val, key, map) => {
      val.cancel();
    });

    this._requests.clear();
  }

  withCancelToken(config, cancelToken) {
    return Object.assign({}, config, {cancelToken});
  }

  all(requests, callback) {
    return this.getRequestBuilder().multi(requests, callback);
  }

  request(method, url, data = {}, headers = {}, config = {}, id = undefined) {
    // создаем токен отмены запроса
    let requestBuilder = this.getRequestBuilder();
    let cancelSource = requestBuilder.buildCancelSource();

    //если это post запрос, то заворачиваем данные в FormData
    if (method === 'post' && !(data instanceof FormData)) {
      data = serialize(data, {indices: true, allowEmptyArrays: config?.allowEmptyArrays});
    }

    // отправляем сам запрос
    let promise = requestBuilder[method](url, data, headers, this.withCancelToken(config, cancelSource.token));
    // оборачиваем запрос в класс, для удобного использования
    let request = (new Request(promise, id)
      )
        .setCancelSource(cancelSource)
    ;

    //пушим запрос в список активных
    this.pushRequest(request);

    return request;
  }

  // для отправки запроса мимо реализации Api
  raw(callback) {
    return callback(this.getRequestBuilder());
  }

  // для отправки запроса, игнорируюя middleware
  force(...args) {
    return new Promise((resolve, reject) => {
      let request = this.request(...args);
      request.get()
        .then(response => resolve(response))
        .catch(error => reject(error))
      ;
    });
  }

  /**
   * регистрация обработчика http-кода ответа
   * @param httpCode
   * @param callback
   * @returns {BaseClient}
   */
  setHttpResponseHandler(httpCode, callback) {
    this._httpHandlers.set(httpCode, callback);
    return this;
  }


  /**
   * регистрация обработки ошибки обновления access_token
   * @param handler
   */
  registerRefreshTokenErrorHandler(handler) {
    this._refreshTokenErrorHandler = handler;
  }

  /**
   * регистрация действия обновления токена
   * @param action
   */
  registerRefreshTokenAction(action) {
    this._refreshTokenAction = action;
  }

  /**
   * отправка запроса на бэк с автоматическим обновлением токена, если требуется
   * @returns {Promise<Response>}
   * @param args
   */
  send(...args) {
    return new Promise((resolve, reject) => {
      this.middleware(() => this.request(...args))
        .then(result => {
          resolve(result);
        })
        .catch(async e => {
          if (e?.getErrorCode() === 'token_expired') {
            try {
              // если токен истек, то проверяем, не идет ли уже запрос обновления токена
              //если идет, то ждем завершения
              if (this._refreshTokenPromise) {
                await this._refreshTokenPromise;
              }
              //если запрос обновления не идет, то запускаем обновление токена и ждем завершения
              else {
                if (this._refreshTokenAction) {
                  this._refreshTokenPromise = this._refreshTokenAction();
                  await this._refreshTokenPromise;
                  this._refreshTokenPromise = null;
                }
                else {
                  reject('access_token истек и не задан refreshTokenAction');
                }
              }
            }
            catch (refreshTokenError) {
              //если и refresh токен истек, то надо вызвать колбек при наличии и бросить исключение выше
              if (refreshTokenError?.getErrorCode() === 'refresh_token_expired' && this._refreshTokenErrorHandler) {
                this._refreshTokenErrorHandler();
              }
              reject('refresh_token истек');
            }

            //повтор исходного запроса
            try {
              resolve(await this.middleware(() => this.request(...args)));
            }
            catch (innerException) {
              reject(innerException);
            }
          }
          //если произошла какая-то другая ошибка, то пропускаем выше
          else {
            reject(e);
          }
        });
    });
  }

  /**
   * Отправка запроса и обработка ответа
   * @param buildRequest
   * @returns {Promise<unknown>}
   */
  middleware(buildRequest) {
    return new Promise((resolve, reject) => {
      let request = buildRequest();
      let validResponse = true;

      // обрабатываем результат
      request.get()
        .then(response => {

          // запрос прошел успешно
          this.removeRequest(request);
          if (this.validateResponse(response)) {
            resolve(Response.fromResponse(response));
          }
          else {
            validResponse = false;
            throw this.getRequestBuilder().createError('', response.config, '', response.request, response);
          }
        })
        .catch(error => {
          //возникла ошибка
          this.removeRequest(request);

          if (this.getRequestBuilder().isCancel(error)) {
            reject(Response.cancelled());
          }
          else if (error.response) {
            let response = error.response;
            let status = response.status;
            this.handleErrorStatus(status, validResponse ? Response.fromResponse(response) : response);
            if (validResponse) {
              reject(Response.invalidResponse(response));
            }
            else {
              reject(Response.httpError(response));
            }
          }
          else if (error.request) {
            reject(Response.noResponse());
          }
          else {
            reject(Response.undefinedError());
          }
        });
    });
  }

  /**
   *
   * @param response
   * @param reason
   * @returns {Response}
   */
  makeResponse(response, reason) {
    return new Response(response, reason);
  }

  handleErrorStatus(status, data = null) {
    switch (status) {
      case 401:
        this.clearAllRequests();
        break;
    }
    if (this._httpHandlers.has(status)) {
      return this._httpHandlers.get(status)(this, data);
    }
  }

  validateResponse(response) {
    return true;
  }
}
