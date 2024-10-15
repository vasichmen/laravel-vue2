import axios from 'axios';
import sourceCreateError from 'axios';

export default class RequestBuilder {
  _instance = null;

  constructor(defaults = undefined) {
    this._instance = axios.create(defaults);
  }

  getInstance() {
    return this._instance;
  }

  merge(...args) {
    return Object.assign({}, ...args);
  }

  buildCancelSource() {
    return axios.CancelToken.source();
  }

  createError(message, config, code, request, response) {
    return sourceCreateError(message, config, code, request, response);
  }

  isCancel(error) {
    return axios.isCancel(error);
  }

  get(url, data, headers, config) {
    return this.getInstance().get(url, this.merge({params: data, headers}, config));
  }

  post(url, data, headers, config) {
    return this.getInstance().post(url, data, this.merge({headers}, config));
  };

  put(url, data, headers, config) {
    return this.getInstance().put(url, data, this.merge({headers}, config));
  }

  delete(url, data, headers, config) {
    return this.getInstance().delete(url, this.merge({headers, data}, config));
  }

  multi(requests, callback) {
    return axios.all(requests).then(axios.spread(callback));
  }
}
