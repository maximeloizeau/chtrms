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
            method: '*',
            path: '/img/fake-logo.png',
            handler: {
               file: './img/fake-logo.png'
            }
        },
        {
            method: '*',
            path: '/css/main.css',
            handler: {
               file: './css/main.css'
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
