'use strict';

module.exports = function() {
    return [
        {
            method: '*',
            path: '/{path*}',
            handler: {
               file: './index.html'
            }
        },
        {
            method: 'GET',
            path: '/dist/bundle.js',
            handler: function (request, reply) {
                return reply.file('./dist/bundle.js');
            }
        }
    ];
}();
