var colors = require('colors'),
    express = require('express');

var app = express();

app.get('/foo/bar', function(request, response){
    console.log('- Request received:', request.method.cyan, request.url.underline);
    
    response.status(200).type('html');
    response.write('<h1>Secret Page</h1>');
    response.write('<p>You\'ve found the super secret page! Well done!</p>');
    response.end();
});

app.get('/source', express.basicAuth('joe', 'foobar'), function(request, response){
    console.log('- Sending source'.yellow);
    response.sendfile(__filename);
});

app.get('*', function(request, response){
    console.log('- Request received:', request.method.cyan, request.url.underline);
    response.send('<h1>Hello, world!</h1><p>Welcome to my server.</p>');
});

app.listen(8080, function(){
    console.log('- Server listening on port 8080'.grey);
});
