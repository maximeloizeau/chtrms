'use strict';

const authController = require('../controllers/authentication');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/login',
            config : {
                handler: authController.login
            }
        },
        {
            method: 'POST',
            path: '/users',
            config : {
                handler: authController.signup
            }
        },
        {
            method: 'POST',
            path: '/logout',
            config : {
                handler: authController.logout
            }
        }
    ];
}();
