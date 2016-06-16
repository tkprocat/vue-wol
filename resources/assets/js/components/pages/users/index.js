module.exports = {

    data: function() {
        return {
            users: [],
            messages: [],
            user: []
        }
    },

    methods: {
        // Let's fetch some users
        fetch: function(successHandler) {
            var that = this
            client({
                path: '/users'
            }).then(
                function(response) {
                    that.$set('users', response.entity.data)
                    successHandler(response.entity.data)
                },
                function(response, status) {
                    if (_.contains([401, 500], status)) {
                        that.$dispatch('userHasLoggedOut')
                    }
                }
            )
        },
        deleteUser: function(index) {
            var that = this
            client({
                path: '/users/' + this.users[index].id,
                method: 'DELETE'
            }).then(
                function(response) {
                    that.users.splice(index, 1)
                    that.messages = [{
                        type: 'success',
                        message: 'Great, users purged.'
                    }]
                },
                function(response) {
                    that.messages.push({
                        type: 'danger',
                        message: 'There was a problem removing the user!'
                    })
                }
            )
        },
        updateUser: function() {
            var that = this
            client({
                path: '/users/' + this.user.id,
                method: 'PUT',
                entity: this.user
            }).then(
                function(response) {
                    that.messages = [{
                        type: 'success',
                        message: 'User updated.'
                    }];
                    $('#updateUserModal').modal('hide');
                },
                function(response) {
                    that.messages.push({
                        type: 'danger',
                        message: 'There was a problem updating the user!'
                    })
                }
            )
        },
        showUpdateUserModal: function(user) {
            this.user = user;
            $('#updateUserModal').modal('show');
        }
    },

    route: {
        data: function(transition) {
            this.fetch(function(data) {
                transition.next({
                    users: data
                })
            })
        }
    }
}