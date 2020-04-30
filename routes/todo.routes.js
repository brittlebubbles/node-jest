const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.post("/", todoController.createTodo);
router.get("/", todoController.getsTodo);
router.get("/:todoId", todoController.getSingleTodo);
router.put("/:todoId", todoController.updateTodo);
router.delete("/:todoId", todoController.deleteTodo);

module.exports = router;
