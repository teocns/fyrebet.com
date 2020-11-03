/**
 * @typedef {string} ErrorCode
 */

class Error {
  errorCode;
  data;

  /**
   *
   * @param {ErrorCode} errorCode Error code found in constants/Error
   * @param {Array} data Array containing error variables
   */
  constructor(errorCode, data) {
    this.errorCode = errorCode;
    this.data = data;
  }
}

export default Error;
