import { success, notFound } from '../../services/response/'
import { Task } from '.'


export const tasksByUser = ({user}, res, next) =>
  Task.find({ user_id: user._id})
    .then(success(res))
    .catch((err)=> {
      console.log(err)
      return Promise.reject(err)
    })
    .catch(next)

export const show = ({ params }, res, next) =>
  Task.findById(params.taskId)
    .then(notFound(res))
    .then((task) => task)
    .then(success(res))
    .catch(next)



export const create = (req, res, next) =>
  Task.create({task: req.body.task, user_id: req.user._id })
  .then(notFound(res))
  .then((result) => {
    if (!result) { return null } else { return result}
  })
  .then(success(res))
  .catch(next)
  



export const rename = ({ bodymen: { body }, params }, res, next) =>
  Task.findById(params.taskId)
    .then(notFound(res))
    .then(task => task.rename(body.task))
    .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)

export const taskDone = ({ params }, res, next) =>
  Task.findById(params.taskId)
    .then(notFound(res))
    .then(task => task.complete())
    .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)

export const taskNotDone = ({params }, res, next) =>
  Task.findById(params.taskId)
    .then(notFound(res))
    .then(task => task.notcomplete())
    .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)
   
export const destroy = ({ params }, res, next) =>
  Task.findById(params.taskId)
    .then(notFound(res))
    .then((task) => task ? task.remove() : null)
    .then(success(res, 204))
    .catch(next)
