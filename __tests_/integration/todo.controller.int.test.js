const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
let firstTodo, newTodoId;
const nonExistingTodoId = "5ea96e5e17f31f173d4738f3";

const testData = { title: "Make int for test PUT", done: true };

describe(endpointUrl, () => {
  it("GET " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  it("Get by Id" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  test("Get by Id doesnt exist" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(
      endpointUrl + "5ea96e5e17f31f173d4738f3"
    );
    expect(response.statusCode).toBe(404);
  });

  it("POST " + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });
  it(
    "Should return error 500 on malformed data with POST" + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: "Missing a property" });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );
  it("PUT" + endpointUrl, async () => {
    const response = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });
  it("DELETE " + endpointUrl, async () => {
    const response = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });
  test("DELETE - return 404", async () => {
    const response = await request(app)
      .delete(endpointUrl + nonExistingTodoId)
      .send();
    expect(response.statusCode).toBe(404);
  });
});
