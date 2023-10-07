import { Router } from "express";
// import Middleware from "../../middlewares/auth";

export default class CrudRouter {
  constructor(prefix, controller) {
    this.prefix = prefix;
    this.controller = controller;
    this.router = Router();

    // const middleware = new Middleware();

    this.router.post("/", (req, res) => {
      this.controller.add(req, res);
    });

    this.router.get("/", (req, res) => {
      this.controller.getAll(req, res);
    });

    this.router.get("/:id", (req, res) => {
      this.controller.show(req, res);
    });

    this.router.put("/:id", (req, res) => {
      this.controller.update(req, res);
    });

    this.router.delete("/:id", (req, res) => {
      this.controller.delete(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}
