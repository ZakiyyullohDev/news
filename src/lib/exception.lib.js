const errors = {
    'WRONG_EMAIL_OR_PASSWORD': 'WRONG_EMAIL_OR_PASSWORD',
    'INTERNAL_SERVER_ERROR': 'INTERNAL_SERVER_ERROR',
    'AUHORIZATION_ERROR': 'AUHORIZATION_ERROR',
    'VALIDATION_ERROR': 'VALIDATION_ERROR',
    'ALREADY_EXISTS': 'ALREADY_EXISTS',
    'NOT_FOUND': 'NOT_FOUND',
}

class HttpException {
    status
    message
    error
    
    constructor(status, message, error) {
        this.status = status;
        this.message = message || '';
        this.error = error;
    }
}

export default {
    HttpException,
    errors
}