module.exports = {

  data: function () {
    return {
      device: {
        id: null,
        name: null,
        ip: null,
        mac: null,
      },
      messages: []
    }
  },

  methods: {
    fetch: function (id, successHandler) {
      var that = this
      client({ path: '/devices/' + id }).then(
        function (response) {
          that.$set('device', response.entity.data)
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

    updateDevice: function (e) {
      e.preventDefault()
      var that = this
      client({ path: '/devices/' + this.device.id, entity: this.device, method: 'PUT'}).then(
        function (response) {
          that.messages = []
          that.messages.push({type: 'success', message: 'Device updated.'})
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
    // Ooh, ooh, are there any new puppies yet?
    data: function (transition) {
      this.fetch(this.$route.params.id, function (data) {
        transition.next({device: data})
      })
    }
  }
}
