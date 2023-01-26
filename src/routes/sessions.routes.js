const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController(); // Instanciando a função

const sessionsRouter = Router();

sessionsRouter.post("/", sessionsController.create);


module.exports = sessionsRouter;
