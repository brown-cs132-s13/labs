var http = require('http'),
    colors = require('colors');

var server = http.createServer(function(request, response){
    console.log('- Request received:', request.method.cyan, request.url.underline);
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    if (request.url == '/foo/bar') {
        response.write('<h1>Secret Page</h1>');
        response.write('<p>You\'ve found the super secret page! Well done!</p>');
        response.end();
    } else {
        response.end('<h1>Hello, world!</h1><p>Welcome to my server.</p>');
    }
});

server.listen(8080, function(){
    console.log('- Server listening on port 8080'.grey);
});
