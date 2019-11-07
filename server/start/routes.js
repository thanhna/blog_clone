'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return "<h1>HELLO ADONIS SERVER</h1>"
})
  .middleware(['country:convertEmptyData'])
  .formats(['json'], true)


Route.group(() => {
  Route.resource('users', 'Admin/UserController')
    .apiOnly()
    .validator(new Map([
      [['store'], ['StoreUser']]
    ]))
    .middleware(new Map([
      [['show'], ['auth']]
    ]))

  Route.post('login', 'Admin/UserController.login')
    .middleware('guest')
}).prefix('admin/')
  .middleware(['country:convertEmptyData:auth'])
  .formats(['json'], true)




