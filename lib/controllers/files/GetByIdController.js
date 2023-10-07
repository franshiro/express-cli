import Controller from './Controller'
import { Message } from '../../utils/Message'

export default class GetByIdController extends Controller {
    constructor(service) {
        super()
        this.service = service
    }

    async get(req, res) {
        const query = req.query

        if (!query.id && !query.request_id) {
            this.setError(400, Message.pleaseProvideDetail)
            return this.send(res)
        }

        try {
            const data = await this.service.get(query)
            if (!data) {
                this.setError(404, Message.noDataFound)
            } else {
                this.setSuccess(200, Message.dataFound, data)
            }

            return this.send(res)
        } catch (error) {
            this.setError(404, error)
            return this.send(res)
        }
    }
}