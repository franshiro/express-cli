import Controller from "./Controller";
import { Message } from "../../utils/Message";

export default class CrudController extends Controller {
  constructor(service) {
    super();
    this.service = service;
  }

  async getAll(req, res) {
    const query = req.query;
    console.log("query: ", query);
    try {
      const data = await this.service.getAll(query);
      if (data && data.items.length > 0) {
        this.setSuccess(
          200,
          Message.dataRetrieved,
          data.items,
          data.paginationInformation
        );
      } else {
        this.setSuccess(404, Message.noDataFound);
      }

      return this.send(res);
    } catch (error) {
      console.log(error);
      this.setError(400, error);
      return this.send(res);
    }
  }

  async add(req, res) {
    console.log("run add function");
    const data = req.body;

    try {
      const create = await this.service.add(data);
      this.setSuccess(201, Message.dataCreated, create);
      return this.send(res);
    } catch (error) {
      console.log("error controller: ", error);
      this.setError(400, error.message);
      return this.send(res);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      this.setError(400, Message.invalidNumeric);
      return this.send(res);
    }

    try {
      const data = await this.service.show(id);
      if (!data) {
        this.setError(404, `${Message.dataNotFoundWithId} ${id}`);
      } else {
        this.setSuccess(200, Message.dataFound, data);
      }

      return this.send(res);
    } catch (error) {
      console.log("error show id: ", error);
      this.setError(404, error);
      return this.send(res);
    }
  }

  async update(req, res) {
    const data = req.body;
    const { id } = req.params;

    if (!Number(id)) {
      this.setError(400, Message.invalidNumeric);
      return this.send(res);
    }

    try {
      const updated = await this.service.update(id, data);
      if (!updated) {
        this.setError(400, `${Message.failedUpdateData} ${id}`);
      } else {
        const newData = await this.service.show(id);
        this.setSuccess(200, Message.dataUpdated, newData);
      }
      return this.send(res);
    } catch (error) {
      this.setError(400, error.message);
      return this.send(res);
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      this.setError(400, Message.invalidNumeric);
      return this.send(res);
    }

    try {
      const deleted = await this.service.delete(id);

      if (deleted) {
        this.setSuccess(200, Message.dataDeleted);
      } else {
        this.setError(404, `${Message.dataNotFoundWithId} ${id}`);
      }

      this.send(res);
    } catch (error) {
      this.setError(404, error.message);
      this.send(res);
    }
  }
}
