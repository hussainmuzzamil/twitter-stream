sys     = require('util');
express = require('express');
twitter = require('ntwitter');

app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res, next){
  res.render('/public/index.html');
});
app.listen(8081);
console.log('Server running at http://localhost:8081/');

var io  = require('socket.io').listen(app);
io.set('log level', 1);

myList = [];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
    socket.on('data', function(action,data) {
	if(action==='+') {
        	myList.push(data);
	}
	else {
		myList.del(data);
	}
    });
    socket.on('getfilter', function() {
        socket.emit('pushfilter', myList);
    });
    if(myList.length!=0) {
        twit.stream('user',{track:myList}, function(stream) {
            stream.on('data', function (tweet) {
  	    	    socket.emit('message', JSON.stringify(tweet));
            });
        });
    }   
});

function CreateTwitter() {
twit = new twitter({
    consumer_key: 'PihGFOQtf4W6os4GWihow',
    consumer_secret: 'n817glyTYOTGwOibFYHlxe0n8pkgp605mjgrWfL5Ss',
    access_token_key: '566571968-9vgdljO3gUaOGFE1gFOkdNgmbiJrMJCFUm42Zo5s',
    access_token_secret: '2cZuFUVKAA8VdrNEE81oTGlqKEGDCdU3tZO1qcZU2U'
});
}
