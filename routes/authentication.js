'use strict';

const authController = require('../controllers/authentication');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/api/login',
            config : {
                handler: authController.login
            }
        },
        {
            method: 'POST',
            path: '/api/users',
            config : {
                handler: authController.signup
            }
        },
        {
            method: 'POST',
            path: '/api/logout',
            config : {
                handler: authController.logout
            }
        }
    ];
}();
