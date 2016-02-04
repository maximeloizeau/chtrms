function App() {
    this.user = undefined;
}

App.prototype.start = function() {
    this.socket = io();
    this.socket.on('message', this.newMessage.bind(this));
}

App.prototype.login = function(username, password) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open('POST', 'http://localhost:8080/login');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xmlhttp.status !== 200) {
            return;
        }

        var response = JSON.parse(xmlhttp.responseText);
        if(!response.token) {
            return alert("Wrong login/password");
        }
        
        this.user = response;
    };
    xmlhttp.send(
        JSON.stringify({
            username: username,
            password: password
        })
    );
}

App.prototype.sendMessage = function(messageText) {
    var message = {
        text: messageText,
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1AZy5jb20iLCJpYXQiOjE0NTQ1Mjc3NDEsImV4cCI6MTQ1NzExOTc0MX0.uhpCNxJg5MM5hcZg3wCd7qo28isbpNiRk8rS3BHssWk'
    };
    this.socket.emit('message', message);
}

App.prototype.newMessage = function(message) {
    console.log(message);
}