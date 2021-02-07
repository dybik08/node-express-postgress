import HttpException from './HttpException';

class EmailOrPasswordNotCorrectException extends HttpException {
    constructor() {
        super(401, 'Email or password not correct');
    }
}

export default EmailOrPasswordNotCorrectException;