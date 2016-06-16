module.exports = {

    data: function() {
        return {
            devices: [],
            device: [],
            messages: []
        }
    },

    methods: {
        // Let's fetch some devices
        fetch: function(successHandler) {
            var that = this
            client({
                path: '/devices'
            }).then(
                function(response) {
                    that.$set('devices', response.entity.data)
                    successHandler(response.entity.data)
                },
                function(response, status) {
                    if (_.contains([401, 500], status)) {
                        that.$dispatch('userHasLoggedOut')
                    }
                }
            )
        },

        deleteDevice: function(index) {
            var that = this
            client({
                path: '/devices/' + this.devices[index].id,
                method: 'DELETE'
            }).then(
                function(response) {
                    that.devices.splice(index, 1)
                    that.messages = [{
                        type: 'success',
                        message: 'Great, devices purged.'
                    }]
                },
                function(response) {
                    that.messages.push({
                        type: 'danger',
                        message: 'There was a problem removing the device!'
                    })
                }
            )
        },
        updateDevice: function() {
            var that = this
            client({
                path: '/devices/' + this.device.id,
                entity: this.device,
                method: 'PUT'
            }).then(
                function(response) {
                    that.messages = []
                    that.messages.push({
                        type: 'success',
                        message: 'Device updated.'
                    });
                    $('#updateDeviceModal').modal('hide');
                },
                function(response) {
                    that.messages = []
                    for (var key in response.entity) {
                        that.messages.push({
                            type: 'danger',
                            message: response.entity[key]
                        })
                    }
                }
            )
        },
        showUpdateDeviceModal: function(device) {
            this.device = device;
            $('#updateDeviceModal').modal('show');
        }
    },

    route: {
        data: function(transition) {
            this.fetch(function(data) {
                transition.next({
                    devices: data
                })
            })
        }
    }
}