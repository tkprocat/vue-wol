module.exports = {

  data: function () {
    return {
      user: {
        id: null,
        username: null,
        email: null,
        password: null,
        password_confirmation: null
      },
      messages: []
    }
  },

  methods: {
    fetch: function (id, successHandler) {
      var that = this
      client({ path: '/users/' + id }).then(
        function (response) {
          that.$set('user', response.entity.data)
          successHandler(response.entity.data)
        },
        function (response, status, request) {
          if (status === 401) {
            this.$dispatch('userHasLoggedOut')
          } else {
            console.log(response)
          }
        }
      )
    },

    updateUser: function (e) {
      e.preventDefault()
      var that = this
      client({ path: '/users/' + this.user.id, entity: this.user, method: 'PUT'}).then(
        function (response) {
          this.password = null
          this.confirm_password = null
          that.messages = []
          that.messages.push({type: 'success', message: 'User updated.'})
        },
        function (response) {
          that.messages = []
          for (var key in response.entity) {
            that.messages.push({type: 'danger', message: response.entity[key]})
          }
        }
      )
    }

  },

  route: {
    data: function (transition) {
      this.fetch(this.$route.params.id, function (data) {
        transition.next({user: data})
      })
    }
  }
}
