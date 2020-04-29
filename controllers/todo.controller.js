const TodoModel = require("../models/Todo.model");

exports.createTodo = async (req, res, next) => {
  try {
    const newTodo = await TodoModel.create(req.body);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
};

exports.getsTodo = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
  } catch (err) {
    next(err);
  }
};

exports.getSingleTodo = async (req, res, next) => {
  try {
    const singleTodos = await TodoModel.findById(req.params.todoId);
    if (singleTodos) {
      res.status(200).json(singleTodos);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};
