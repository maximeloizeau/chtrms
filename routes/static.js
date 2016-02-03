'use strict';

module.exports = function() {
    return [
    {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                return reply.file('./index.html');
            }
        },
        {
            method: 'GET',
            path: '/js/app.js',
            handler: function (request, reply) {
                return reply.file('./js/app.js');
            }
        }
    ];
}();
