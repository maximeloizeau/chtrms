'use strict';

const userController = require('../controllers/user');

module.exports = function() {
    return [
        {
            method: 'GET',
            path: '/api/users/me/',
            config : {
                handler: userController.me
            }
        }
    ];
}();
