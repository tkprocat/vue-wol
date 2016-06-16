module.exports = {
  data: function () {
    return {
      user: {
        username: '',
        email: ''
      },
      messages: []
    }
  },

  methods: {
    createUser: function (e) {
      e.preventDefault()
      var that = this
      client({path: 'register', entity: this.user}).then(
        function (response, status) {
          that.user.username = ''
          that.user.email = ''
          that.messages = [ {type: 'success', message: 'User account created, an email has been sent to the user with login information.'} ]
          Vue.nextTick(function () {
            document.getElementById('username').focus()
          })
        },
        function (response, status) {
          that.messages = []
          for (var key in response.entity) {
            that.messages.push({type: 'danger', message: response.entity[key]})
          }
        }
      )
    }
  }
}
