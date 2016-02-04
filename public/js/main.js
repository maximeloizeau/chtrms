var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

var store = {
  state: {
    message: 'Hello!'
  },
  actionA: function () {
    this.state.message = 'action A triggered'
  },
  actionB: function () {
    this.state.message = 'action B triggered'
  }
}

// Define some components
var Login = Vue.extend({
    template: '<section id="login">login</section>'
});

var RoomsList  = Vue.extend({
    template: '<section id="chatrooms">chatrooms</section>'
});

var App = Vue.extend({});

var router = new VueRouter();

router.map({
    '/login': {
        component: Login
    },
    '/rooms': {
        component: RoomsList
    }
});

router.start(App, '#app')