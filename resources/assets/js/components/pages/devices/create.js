module.exports = {
    data: function() {
        return {
            device: {
                name: '',
                mac: '',
                ip: '',
            },
            messages: []
        }
    },

    methods: {
        createDevice: function(e) {
            e.preventDefault()
            var that = this
            client({
                path: 'devices',
                entity: this.device,
                method: 'POST'
            }).then(
                function(response, status) {
                    that.device.name = ''
                    that.device.mac = ''
                    that.device.ip = ''
                    that.messages = [{
                        type: 'success',
                        message: 'Device created.'
                    }]
                    that.$route.router.go('/devices');
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
        }
    }
}