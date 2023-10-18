export default class Response {
  _response = null;
  _content = null;
  _error = null;
  _errorCode = null;
  _errorMessage = null;
  _errorData = null;

  constructor(response, content, error = 0, errorCode = null, errorMessage = null, errorData = null) {
    this._response = response;
    this._content = content;
    this._error = error;
    this._errorCode = errorCode;
    this._errorMessage = errorMessage;
    this._errorData = errorData;
  }

  static fromResponse(response) {
    let hasError = response.data.error !== 0;
    return new Response(
      response,
      response.data.content,
      hasError,
      response.data.content?.error_code,
      response.data.content?.error_message,
      response.data.content?.error_data,
    );
  }

  static cancelled() {
    return new Response(
      null,
      null,
      1,
      'request_cancelled_by_client',
    );
  }

  static httpError(response) {
    return new Response(
      response,
      null,
      1,
      'invalid_http_code',
      'Произошла ошибка на сервере. Пожалуйста, попробуйте снова',
    );
  }

  static invalidResponse(response) {
    return new Response(
      response,
      response.data,
      1,
      response.data?.errorCode,
      response.data?.errorMessage,
      response.data?.errorBag,
    );
  }

  static noResponse() {
    return new Response(
      null,
      null,
      1,
      'no_response',
      'Не удалось отправить запрос. Пожалуйста, попробуйте снова',
    );
  }

  static undefinedError() {
    return new Response(
      null,
      null,
      1,
      'undefined_error',
      'Не удалось отправить запрос. Пожалуйста, попробуйте снова',
    );
  }

  /**
   *
   * @returns {Object}
   */
  getContent() {
    return this._content;
  }

  hasError() {
    return this._error === 1;
  }

  getErrorCode() {
    return this._errorCode;
  }

  getErrorMessage() {
    return this._errorMessage;
  }

  getErrorData() {
    return this._errorData;
  }

  getResponse() {
    return this._response;
  }

  getHeaders() {
    return this.getResponse()?.headers;
  }

  getRawData() {
    return this.getResponse()?.data;
  }

  getStatus() {
    return this.getResponse()?.status;
  }

  getConfig() {
    return this.getResponse()?.config;
  }
}
