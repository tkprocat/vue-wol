module.exports = {

    data: function() {
        return {
            devices: [],
            messages: [],
            selectedDevice: []
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
        bootDevice: function(e) {
            e.preventDefault()
            var that = this
            var selected = this.devices.find(function(device) {
                return device.mac === that.selectedDevice;
            });
            client({
                path: 'devices/boot',
                entity: selected
            }).then(
                function(response, status) {
                    that.pingDevice();
                    that.messages = [{
                        type: 'success',
                        message: 'Magic packet sent.'
                    }];
                },
                function(response, status) {
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
        pingDevice: function() {
            var that = this
            var selected = this.devices.find(function(device) {
                return device.mac === that.selectedDevice;
            });
            client({
                path: 'devices/ping',
                entity: selected
            }).then(
                function(response, status) {
                    console.log(response.entity.message);
                    that.messages.push({
                        type: 'success',
                        message: response.entity.message
                    });
                    console.log(that.messages);
                    console.log('test');
                    if (response.entity.status === 'down') {
                        setTimeout(that.pingDevice(), 3000);
                    }
                },
                function(response, status) {
                    console.log('Something went wrong!');
                }
            )
        },
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