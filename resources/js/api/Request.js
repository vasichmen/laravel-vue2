import {v4 as uuidv4} from 'uuid';

export default class Request {
  _id = null;
  _request = null;
  _cancelSource = null;

  constructor(request, id) {
    this._request = request;
    this._id = id ? id : uuidv4();
  }

  setCancelSource(src) {
    this._cancelSource = src;
    return this;
  }

  cancel() {
    return this._cancelSource && this._cancelSource.cancel();
  }

  get() {
    return this._request;
  }

  getID() {
    return this._id;
  }
}
