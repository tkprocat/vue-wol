module.exports = {

  configRouter: function (router) {

    router.map({
      '/auth': {
        component: require('./compiled/pages/auth.vue'),
        subRoutes: {
          '/login': {
            component: require('./compiled/pages/auth/login.vue'),
            guest: true
          },
          '/register': {
            component: require('./compiled/pages/auth/register.vue'),
            guest: true
          },
          '/profile': {
            component: require('./compiled/pages/auth/profile.vue'),
            auth: true
          },
          '/logout': {
            component: require('./compiled/pages/auth/logout.vue'),
            auth: true
          }
        }
      },
      '/home': {
        component: require('./compiled/pages/home.vue'),
        auth: true,
        subRoutes: {
          '/': {
            component: require('./compiled/pages/home/index.vue')
          },
        }
      },
      '/devices': {
        component: require('./compiled/pages/devices.vue'),
        auth: true,
        subRoutes: {
          '/': {
            component: require('./compiled/pages/devices/index.vue')
          },
          '/:id': {
            component: require('./compiled/pages/devices/show.vue')
          },
          '/create': {
            component: require('./compiled/pages/devices/create.vue')
          }
        }
      },
      '/users': {
        component: require('./compiled/pages/users.vue'),
        auth: true,
        subRoutes: {
          '/': {
            component: require('./compiled/pages/users/index.vue')
          },
          '/:id': {
            component: require('./compiled/pages/users/show.vue')
          },
          '/create': {
            component: require('./compiled/pages/users/create.vue')
          }
        }
      },
      '*': {
        component: require('./compiled/pages/404.vue')
      }
    })

    router.alias({
      '': '/home',
      '/auth': '/auth/login'
    })

    router.beforeEach(function (transition) {
      var token = localStorage.getItem('jwt-token')
      if (transition.to.auth) {
        if (!token || token === null) {
          transition.redirect('/auth/login')
        }
      }
      if (transition.to.guest) {
        if (token) {
          transition.redirect('/auth/login')
        }
      }
      transition.next()
    })
  }
}
