import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import  { User } from '../user'
import routes, { Task } from './'

const app = () => express(apiRoot, routes)

let user1, session1, task

beforeEach(async () => {
  user1 = await User.create({ name: 'user', email: 'a@a.com', password: '123456' })
  task = await Task.create({task: "my Task", userId: user1.id})
  session1 = signSync(user1.id)
})

test('GET /users/:userId/tasks 200' , async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks")
    .query({ access_token: session1 })
    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
})


test('GET /users/abc/tasks 500' , async () => {
  const { status, body } = await request(app())
    .get("/users/" + "abc"+ "/tasks")
    .query({ access_token: session1 })
    expect(status).toBe(500)
})


test('GET /users 401', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks")
    expect(status).toBe(401)
})


test('GET /users/:userId/tasks/:taskId 200', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + task._id)
    .query({ access_token: session1 })
    expect(status).toBe(200)
})

test('GET /users/:userId/tasks/:taskId 401', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + task._id)
    expect(status).toBe(401)
})

test('GET /users/:userId/tasks/:taskId 500', async () => {
  const { status, body } = await request(app())
    .get("/users/" + user1.id + "/tasks/" + "abc")
    .query({ access_token: session1 })
    expect(status).toBe(500)
})


test('POST /users/:userId/tasks/ 201', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({ task: 'test' })
  .query({ access_token: session1 })
  expect(status).toBe(201)
})

test('POST /users/:userId/tasks/ 401', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({ task: 'test' })
  expect(status).toBe(401)
})

test('POST /users/:userId/tasks/ 400', async () => {
  const { status, body } = await request(app())
  .post("/users/" + user1.id + "/tasks")
  .send({})
  .query({ access_token: session1 })
  expect(status).toBe(400)
})


test('PUT /users/:userId/tasks/:taskId/rename 401', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({task: "new name"})
  expect(status).toBe(401)
})



test('PUT /users/:userId/tasks/:taskId/rename 400', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({})
  .query({ access_token: session1 })
  expect(status).toBe(400)
})

test('PUT /users/:userId/tasks/:taskId/rename 200', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/rename")
  .send({task: "new name"})
  .query({ access_token: session1 })
  expect(body.task).toBe("my Task")
  expect(status).toBe(200)
})


test('PUT /users/:userId/tasks/:taskId/done 401', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/done")
  expect(status).toBe(401)
})


test('PUT /users/:userId/tasks/:taskId/done 200', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/done")
  .query({ access_token: session1 })
  expect(body.done).toBe(false)
  expect(status).toBe(200)
})

test('PUT /users/:userId/tasks/:taskId/not-done 401', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/not-done")
  expect(status).toBe(401)
})

test('PUT /users/:userId/tasks/:taskId/not-done 200', async () => {
  const { status, body } = await request(app())
  .put("/users/" + user1.id + "/tasks/" + task._id + "/not-done")
  .query({ access_token: session1 })
  expect(status).toBe(200)
})


test('DELETE /users/:userId/tasks/:taskId/ 204 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + task._id)
    .send({ access_token: session1 })
  expect(status).toBe(204)
})


test('DELETE /users/:userId/tasks/:taskId/ 500 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + "abc")
    .send({ access_token: session1 })
  expect(status).toBe(500)
})

test('DELETE /users/:userId/tasks/:taskId/ 401 ', async () => {
  const { status } = await request(app())
    .delete("/users/" + user1.id + "/tasks/" + task._id)
  expect(status).toBe(401)
})
