import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { show, create, tasksByUser, taskDone, taskNotDone, rename , destroy} from './controller'
import { schema } from './model'
export Task, { schema } from './model'

const router = new Router()
const { task, done } = schema.tree

/**
 * @api {get} / Retrieve current task
 * @apiName RetrieveCurrentTask
 * @apiGroup Task
 * @apiPermission none
 * @apiParam {String} access_token Task access_token.
 * @apiSuccess {Object} task Task's data.
 */
router.get('/',
  token({ required: true }),
  tasksByUser)

/**
 * @api {get} /:taskId Retrieve task
 * @apiName RetrieveTask
 * @apiGroup Task
 * @apiPermission none
 * @apiSuccess {Object} task Task's data.
 * @apiError 404 Task not found.
 */
router.get('/:taskId',
  token({ required: true }),
  query(),
  show)

  /**
 * @api {post} / Retrieve task
 * @apiName RetrieveTask
 * @apiGroup Task
 * @apiPermission none
 * @apiSuccess {Object} task Task's data.
 * @apiError 404 Task not found.
 */

router.post("/", 
  token({ required: true }),
  create);

/**
 * @api {put} /users/:userId/tasks/rename rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiParam {String} [task] Task's name.
 * @apiError 404 Task not found.
 */
router.put('/:taskId/rename',
  token({ required: true }),
  body({ task }),
  rename)

/**
 * @api {put} /users/:userId/tasks/done rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiError 404 Task not found.
 */
router.put('/:taskId/done',
  token({ required: true }),
  taskDone)

/**
 * @api {put} /users/:userId/tasks/done rename task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission task
 * @apiError 404 Task not found.
 */
router.put('/:taskId/not-done',
  token({ required: true }),
  taskNotDone)

/**
 * @api {delete} /users/:userId/tasks/:id Delete task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiParam {String} access_token Task access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Task not found.
 */
router.delete('/:taskId',
  token({ required: true }),
  destroy)

export default router
