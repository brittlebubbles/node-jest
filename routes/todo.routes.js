const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.post("/", todoController.createTodo);
router.get("/", todoController.getsTodo);
router.get("/:todoId", todoController.getSingleTodo);

module.exports = router;
