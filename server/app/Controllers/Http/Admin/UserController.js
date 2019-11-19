'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('Event')
const Status = use('App/Constants/Status')
const Message = use('App/Constants/Message')
const User = use('App/Models/User')
const { LoggerPermanentException } = use('App/Helpers/Loggers')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response }) {
    try {
      if (auth.user.role === 1) {
        let users = await User.all()
        return response.SucessResponse(users);
      }
      return response.BadResponseException(null, Message.PROFILE_PERMISSION_ERROR);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      let body = request.post()
      let user = await User.create(body)
      if (user) Event.fire('user::registered', user)
      return response.SucessResponse(user, null, Status.Created);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, params, request, response }) {
    try {
      let { id } = params
      if (auth.user.role === 1) return response.SucessResponse(auth.user); //ADMIN
      if (auth.user.id !== Number(id)) {
        return response.BadResponseException({ id }, Message.PROFILE_SEE_ERROR);
      }
      return response.SucessResponse(auth.user);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, params, request, response }) {
    try {
      let { id } = params;
      let body = request.post()
      //ADMIN hoặc chính nó
      if (auth.user.role === 1 || auth.user.id === Number(id)) {
        let update = await User.query().where('id', id).update(body)
        if (body.password) {
          let user = await User.find(id)
          user.password = body.password
          await user.save()
        }
        return response.SucessResponse({ update });
      }
      return response.BadResponseException({ id }, Message.PROFILE_UPDATE_ERROR);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ auth, params, request, response }) {
    try {
      let { id } = params;
      if (auth.user.role === 1 || auth.user.id === Number(id)) {
        let destroy = await User.query().where('id', id).update({ status: false })
        return response.SucessResponse(destroy);
      }
      return response.BadResponseException({ id }, Message.PROFILE_PERMISSION_ERROR);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  async login({ auth, request, response }) {
    let { email, password } = request.post()
    try {
      let jwt = await auth.query((builder) => {
        builder.where('status', true)
      }).withRefreshToken().attempt(email, password)
      return response.SucessResponse(jwt);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }

  async destroyForever({ auth, params, request, response }) {
    try {
      let { id } = params;
      let data = request.post();
      if (auth.user.role === 1) {
        let arr = [id]
        if (data.id) arr = data.id
        let destroy = await User.query().whereIn('id', arr).delete()
        return response.SucessResponse(destroy);
      }
      return response.BadResponseException({ id }, Message.PROFILE_PERMISSION_ERROR);
    } catch (error) {
      LoggerPermanentException(error, request, request.post())
      return response.BadResponseException(request.post(), error.message);
    }
  }
}

module.exports = UserController
