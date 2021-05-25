import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import  { User } from '../user'
import routes, { Task } from './'

const app = () => express(apiRoot, routes)

let user1,user2, session1, session2, task

beforeEach(async () => {
  user1 = await User.create({ name: 'userA', email: 'a@a.com', password: '123456' })
  user2 = await User.create({ name: 'userB', email: 'b@b.com', password: '123456' })
  task = await Task.create({task: "my Task", user_id: user1.id})
  session1 = signSync(user1.id)
  session2 = signSync(user2.id)
})

test('GET /users/:user_id/tasks 200' , async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks")
    .query({ access_token: session1 })
    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
})

test('GET /users/:user_id/tasks 401' , async () => {
  const { status } = await request(app())
    .get("/users/" + user1.id + "/tasks")
    .query({ access_token: session2 })
    expect(status).toBe(401)
})


test('GET /users/:user_id/tasks 401', async () => {
  const { status } = await request(app())
    .get("/users/" + user1.id + "/tasks")
    expect(status).toBe(401)
})


test('GET /users/:user_id/tasks/:task_id 200', async () => {
  const { status, body} = await request(app())
    .get("/users/" + user1.id + "/tasks/" + task._id)
    .query({ access_token: session1 })
    expect(body.task).toBe('my Task')
    expect(body.done).toBe(false)
    expect(status).toBe(200)
})

test('GET /users/:user_id/tasks/:task_id 401', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + task._id)
    expect(status).toBe(401)
})

test('GET /users/:user_id/tasks/:task_id 500', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + "abc")
    .query({ access_token: session1 })
    expect(status).toBe(500)
})


test('GET /users/:user_id/tasks/:task_id 401', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + "abc")
    .query({ access_token: session2 })
    expect(body.message).toBe('access denied')
    expect(status).toBe(401)
})

test('GET /users/:user_id/tasks/:task_id 401', async () => {
  const { status, body } = await request(app())
    .get("/users/" + "abc" + "/tasks/" + "abc")
    .query({ access_token: session1 })
    expect(status).toBe(401)
})

test('GET /users/:user_id/tasks/:task_id 500', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + "abc")
    .query({ access_token: session2 })
    expect(status).toBe(401)
})


test('POST /users/:user_id/tasks/ 201', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({ task: 'test' })
  .query({ access_token: session1 })
  expect(body.task).toBe('test')
  expect(body.done).toBe(false)
  expect(status).toBe(201)
})

test('POST /users/:user_id/tasks/ 401', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({ task: 'test' })
  .query({ access_token: session2 })
  expect(body.message).toBe('access denied')
  expect(status).toBe(401)
})

test('POST /users/:user_id/tasks/ 401', async () => {
  const { status } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({ task: 'test' })
  expect(status).toBe(401)
})

test('POST /users/:user_id/tasks/ 400', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send(body)
  .query({ access_token: session1 })
  expect(body.message).toBe("task is required")
  expect(status).toBe(400)
})


test('POST /users/:user_id/tasks/ 401', async () => {
  const { status } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  expect(status).toBe(401)
})


test('PUT /users/:user_id/tasks/:task_id/rename 401', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({task: "new name"})
  expect(status).toBe(401)
})



test('PUT /users/:user_id/tasks/:task_id/rename 400', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({})
  .query({ access_token: session1 })
  expect(status).toBe(400)
})

test('PUT /users/:user_id/tasks/:task_id/rename 200', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({task: "new name"})
  .query({ access_token: session1 })
  expect(body.task).toBe("my Task")
  expect(status).toBe(200)
})


test('PUT /users/:user_id/tasks/:task_id/done 401', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/done")
  expect(status).toBe(401)
})


test('PUT /users/:user_id/tasks/:task_id/done 200', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/done")
  .query({ access_token: session1 })
  expect(body.done).toBe(false)
  expect(status).toBe(200)
})

test('PUT /users/:user_id/tasks/:task_id/not-done 401', async () => {
  const { status } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/not-done")
  expect(status).toBe(401)
})

test('PUT /users/:user_id/tasks/:task_id/not-done 200', async () => {
  const { status } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/not-done")
  .query({ access_token: session1 })
  expect(status).toBe(200)
})


test('DELETE /users/:user_id/tasks/:task_id/ 204 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + task._id)
    .send({ access_token: session1 })
  expect(status).toBe(204)
})


test('DELETE /users/:user_id/tasks/:task_id/ 500 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + "abc")
    .send({ access_token: session1 })
  expect(status).toBe(500)
})

test('DELETE /users/:user_id/tasks/:task_id/ 401 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + task._id)
  expect(status).toBe(401)
})
