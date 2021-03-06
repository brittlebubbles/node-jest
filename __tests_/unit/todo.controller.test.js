const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/Todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todo.json");

//// a longer method of mocking a Model
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete(todoId)

// a shorter method for mocking
jest.mock("../../models/Todo.model");

let req, res, next;
const todoId = "5ea96e5e17f31f173d5838f4";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });
  it("Should have a createTodo Function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("Should call .create from mongoose", () => {
    TodoController.createTodo(req, res);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  it("Should return 201 response code", async () => {
    await TodoController.createTodo(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("Should return json body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it("Should handle errors", async () => {
    const errorMessage = { message: "Done property message" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("TodoController.getsTodo", () => {
  it("Should have a getTodos function", () => {
    expect(typeof TodoController.getsTodo).toBe("function");
  });
  it("Should call the .find()", async () => {
    await TodoController.getsTodo(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });
  it("Should return response with status 200 and get all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getsTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
  it("Should handle errors in getTodos", async () => {
    const errorMessage = { message: "Error Finding messages" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getsTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("TodoController.getSingleTodo", () => {
  it("Should be a function", () => {
    expect(typeof TodoController.getSingleTodo).toBe("function");
  });
  it("Should call .findAll() and add the route parameters", async () => {
    req.params.todoId = todoId;
    await TodoController.getSingleTodo(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });
  it("Should return StatusCode of 200(Success) and get Single Todo", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getSingleTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("Should handle errors", async () => {
    const errorMessage = { message: "Error Finding Single Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getSingleTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("Should return 404(NOT FOUND) when Id doesnt exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getSingleTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.updateTodo", () => {
  it("Should have be a function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });
  it("Should update the .findByIdAndUpdate", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
    });
  });
  it("Should return response with Json and a StatusCode of 200", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it("Should handle errors", async () => {
    const errorMessage = { message: "Error Finding Single Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("Should return 404(NOT FOUND) when Id doesnt exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.deleteTodo", () => {
  it("Should be a fuction", () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });
  it("Should call the .delete from mongoose", async () => {
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
  });
  it("Should reutrn StatusCode of 200 and delete TodoModel", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("Should handle errors", async () => {
    const errorMessage = { message: "Error Deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("Should return 404(NOT FOUND) when Id doesnt exist", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
