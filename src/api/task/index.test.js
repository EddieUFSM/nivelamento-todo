import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import  { User } from '../user'
import routes, { Task } from './'

const app = () => express(apiRoot, routes)

let user1, session1, task

beforeEach(async () => {
  user1 = await User.create({ name: 'userA', email: 'a@a.com', password: '123456' })
  task = await Task.create({task: "my Task", user_id: user1._id})
  session1 = await signSync(user1._id)
})

test('GET /tasks 200' , async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: session1 })
    expect(status).toBe(200)
})

test('GET /tasks 401' , async () => {
  const { status } = await request(app())
    .get(apiRoot)
    expect(status).toBe(401)
})


test('GET /tasks/:taskId 200', async () => {
  const { status, body} = await request(app())
    .get(apiRoot +"/"+ task._id)
    .query({ access_token: session1 })
    expect(body.task).toBe('my Task')
    expect(body.done).toBe(false)
    expect(status).toBe(200)
})

test('GET /tasks/:taskId 401', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${task._id}`)
    expect(status).toBe(401)
})

test('GET /tasks/abc 500', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/abc`)
    .query({ access_token: session1 })
    expect(status).toBe(500)
})


test('GET /tasks/:taskId 401', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${task._id}`)
    expect(status).toBe(401)
})



test('POST /tasks/ 200', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .auth('a@a.com', '123456')
    .query({ access_token: session1 })
    .send({ task: 'test' })
    expect(body.task).toBe('test')
    expect(body.done).toBe(false)
    expect(status).toBe(200)
})


test('POST /tasks/ 401', async () => {
  const { status } = await request(app())
    .post(apiRoot)
    .auth('a@a.com', '123456')
    .send({ task: 'test' })
    expect(status).toBe(401)
})

test('POST /tasks/ 500', async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .auth('a@a.com', '123456')
    .send({})
    .query({ access_token: session1 })
    expect(status).toBe(500)
})


test('POST /tasks/ 401', async () => {
  const { status } = await request(app())
    .post(apiRoot)
    .auth('a@a.com', '123456')
    expect(status).toBe(401)
})


test('PUT /tasks/:taskId/rename 401', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/rename`)
    .send({task: "new name"})
    expect(status).toBe(401)
})



test('PUT /tasks/:taskId/rename 400', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/rename`)
    .send({})
    .query({ access_token: session1 })
    expect(status).toBe(400)
})

test('PUT /tasks/:taskId/rename 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/rename`)
    .send({task: "new name"})
    .query({ access_token: session1 })
    expect(body.task).toBe("new name")
    expect(status).toBe(200)
})


test('PUT /tasks/:taskId/done 401', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/done`)
    expect(status).toBe(401)
})


test('PUT /tasks/:taskId/done 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/done`)
    .query({ access_token: session1 })
    expect(body.done).toBe(true)
    expect(status).toBe(200)
})

test('PUT /tasks/:taskId/not-done 401', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/not-done`)
    expect(status).toBe(401)
})

test('PUT /tasks/:taskId/not-done 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}/not-done`)
    .query({ access_token: session1 })
    expect(body.done).toBe(false)
    expect(status).toBe(200)
})

test('DELETE /tasks/:taskId/ 204 ', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${task._id}`)
    .send({ access_token: session1 })
    expect(status).toBe(204)
})


test('DELETE /tasks/:taskId/ 500 ', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/abc`)
    .send({ access_token: session1 })
    expect(status).toBe(500)
})

test('DELETE /tasks/:taskId/ 401 ', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${task._id}`)
    expect(status).toBe(401)
})
