import { success, notFound } from '../../services/response/'
import { Task } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Task.find(query, select, cursor)
    .then((tasks) => tasks)
    .then(success(res))
    .catch(next)


export const tasksByUser = ({ params }, res, next) =>
  Task.find({user_id: params.user_id})
    .then((tasks) => tasks)
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Task.findById(params.task_id)
    .then(notFound(res))
    .then((task) => task)
    .then(success(res))
    .catch(next)

export const create = ({ bodymen: { body }, params }, res, next) =>
  Task.create({task: body.task, user_id: params.user_id})
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err) {
        res.status(400).json({
        })
      } else {
        next(err)
      }
    })

export const rename = ({ bodymen: { body }, params, user }, res, next) =>
  Task.findByIdAndUpdate(params.task_id, {task: body.task})
    .then(notFound(res))
    .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)

export const taskDone = ({ params, user }, res, next) =>
  Task.findByIdAndUpdate(params.task_id, {done: true})
    .then(notFound(res))
    .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)

export const taskNotDone = ({params, user }, res, next) =>
  Task.findByIdAndUpdate(params.task_id, {done: false})
    .then(notFound(res))
     .then((result) => {
      if (!result) { return null } else { return result}
    })
    .then(success(res))
    .catch(next)
   
export const destroy = ({ params }, res, next) =>
  Task.findById(params.task_id)
    .then(notFound(res))
    .then((task) => task ? task.remove() : null)
    .then(success(res, 204))
    .catch(next)
