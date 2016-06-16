module.exports = {

    data: function() {
        return {
            old_password: null,
            password: null,
            password_confirmation: null,
            messages: [],
            password_change_messages: [],
            user :this.$route.params.user,
        }
    },

    methods: {
        changePassword: function(e) {
            e.preventDefault();
            var that = this
            client({
                path: 'users/' + that.$root.user.id + '/changePassword',
                entity: {
                    'old_password': that.old_password,
                    'password': that.password,
                    'password_confirmation': that.password_confirmation
                },
                method: 'PUT'
            }).then(
                function(response, status) {
                    that.old_password = null;
                    that.password = null;
                    that.password_confirmation = null;
                    that.password_change_messages = [{
                        type: 'success',
                        message: 'Password changed.'
                    }]
                },
                function(response, status) {
                    that.password_change_messages = []
                    for (var key in response.entity) {
                        that.password_change_messages.push({
                            type: 'danger',
                            message: response.entity[key]
                        })
                    }
                }
            )
        },
        updateUser: function(e) {
            e.preventDefault();
            var that = this
            client({
                path: '/users/' + this.$root.user.id,
                method: 'PUT',
                entity: this.$root.user
            }).then(
                function(response) {
                    that.messages = [{
                        type: 'success',
                        message: 'Profile updated.'
                    }];
                },
                function(response) {
                    that.messages.push({
                        type: 'danger',
                        message: 'There was a problem updating the profile!'
                    })
                }
            )
        },
    },    
}