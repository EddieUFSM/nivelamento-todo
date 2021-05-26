import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import {compare_logged_identity_with_identity_id_param} from '../../services/middleware/compare_logged_identity_identity_id_params'
import { index, show, create, tasksByUser, taskDone, taskNotDone, rename , destroy} from './controller'
import { schema } from './model'
export Task, { schema } from './model'

const router = new Router()
const { task, done } = schema.tree

/**
 * @api {get} /users/:userId/tasks Retrieve current task
 * @apiName RetrieveCurrentTask
 * @apiGroup Task
 * @apiPermission none
 * @apiParam {String} access_token Task access_token.
 * @apiSuccess {Object} task Task's data.
 */
router.get('/users/:userId/tasks',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  tasksByUser)

/**
 * @api {get} /users/:userId/tasks/:taskId Retrieve task
 * @apiName RetrieveTask
 * @apiGroup Task
 * @apiPermission none
 * @apiSuccess {Object} task Task's data.
 * @apiError 404 Task not found.
 */
router.get('/users/:userId/tasks/:taskId',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  query(),
  show)

/**
 * @api {post} /users/:userId/tasks Create task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiPermission none
 * @apiParam {String} task 
 * @apiSuccess (Sucess 201) {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.post('/users/:userId/tasks',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  body({ task }),
  create)

/**
 * @api {put} /users/:userId/tasks/rename rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiParam {String} [task] Task's name.
 * @apiError 404 Task not found.
 */
router.put('/users/:userId/tasks/:taskId/rename',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  body({ task }),
  rename)

/**
 * @api {put} /users/:userId/tasks/done rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiError 404 Task not found.
 */
router.put('/users/:userId/tasks/:taskId/done',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  taskDone)

/**
 * @api {put} /users/:userId/tasks/done rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiError 404 Task not found.
 */
router.put('/users/:userId/tasks/:taskId/not-done',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  taskNotDone)

/**
 * @api {delete} /users/:userId/tasks/:id Delete task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiParam {String} access_token Task access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Task not found.
 */
router.delete('/users/:userId/tasks/:taskId',
  token({ required: true }),
  compare_logged_identity_with_identity_id_param(),
  destroy)

export default router
