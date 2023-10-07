export default class Controller {
    constructor() {
        this.statusCode = null
        this.type = null
        this.data = null
        this.pagination = null
        this.message = null
    }

    setSuccess(statusCode, message, data, pagination) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.pagination = pagination
        this.type = 'success'
    }

    setError(statusCode, message) {
        this.statusCode = statusCode
        this.message = message
        this.type = 'error'
    }

    send(response) {
        const { type: status, message, data, pagination } = this

        if (status === 'success') {
            return response.status(this.statusCode).json({
                status: status,
                message: message,
                data: data,
                pagination: pagination
            })
        }

        return response.status(this.statusCode).json({
            status: status,
            message: message
        })
    }
}