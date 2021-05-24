import crypto from 'crypto'
import { Task } from '.'

let task

beforeEach(async () => {
  task = await Task.create({ task: 'task' })
})

describe('set task', () => {
  it('sets task automatically', () => {
    task.task = 'first task'
    expect(task.task).toBe('first task')
  })

  it('sets status done automatically', () => {
    task.done = true
    expect(task.done).toBe(true)
  })

})
