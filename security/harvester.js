var express = require('express');

var app = express();

//Don't change this!
app.set('domain', 'localhost');
//End

app.get('/harvest', function(request, response){
    console.log(request.query);
    //Send back a tiny invisible GIF
    response.set('Content-Type', 'image/gif');
	response.end('GIF89a\x01\x00\x01\x00p\x00\x00!\xf9\x04\x05\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
});

app.listen(3011);