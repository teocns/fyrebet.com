import ErrorCodes from "../constants/errors";

export default class Error {
  constructor(any) {
    if (typeof any === "string") {
      this.errorCode = any;
    } else {
      const { errorCode, variables } = any;
      this.errorCode = errorCode;
      this.variables = variables;
    }
  }
  toString() {
    let mesg = ErrorCodes[this.errorCode];
    if (this.variables) {
      mesg = mesg.toString().format(this.variables);
    }
    return mesg;
  }

  static inRespose(responseObject) {
    if ("errorCode" in responseObject) {
      return true;
    }
    return false;
  }
}
