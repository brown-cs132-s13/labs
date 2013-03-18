//See README.md

var express = require('express');
var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3://users.db');

var app = express();

app.use(express.cookieParser('aacb87*nnai'));

//Don't change this!
app.set('domain', 'localhost');
//End

app.get('/', function(request, response){
	response.set('Content-Type', 'text/html');
	conn.query('SELECT * FROM posts', function(err, res){
		if (err){
    		console.error(err);
    		response.end('<h1>Error! (this should not happen)</h1>');
    		return;
    	}
    	var page = '';
    	for(var i=0;i<res.rows.length;i++){
    		page += '<h2>Post ' + i + '</h2>';
    		page += '<p>by <strong>' + res.rows[i].username + '</strong></p>';
    		page += '<p>' + res.rows[i].body + '</p>';
    	}
    	page += '<small>Or check out some users!</small>';
    	response.end(page);
	});
});

app.get('/login', function(request, response){
	conn.query('SELECT password FROM users WHERE username=$1', [request.query.username], function(err, res){
		if (err){
    		console.error(err);
    		response.end('<h1>Error!</h1>');
    		return;
    	}
    	if (request.query.password !== res.rows[0].password || res.rows.length == 0 || !res.rows[0]){
    		response.end('Bad username or password.');
    	}
		else{
			response.cookie('user', request.query.username, {signed: true});
			response.end('You\'re logged in as ' + request.query.username);
		}
	});
});

app.get('/become-sbraun', function(request, response){
	response.set('Content-Type', 'text/html');
	response.cookie('user', 'sbraun', {signed: true});
	response.end('Hello, sbraun. You should check out the <a href="/">latest posts by jbieber!</a>');
});

app.get('/reset', function(request, response){
	response.clearCookie('user');
	response.end('Reset!');
})

app.get('/write-post', function(request, response){
	if (request.query.username != request.signedCookies.user){
		response.end('<h1>Not authenticated!</h1>')
		return;
	}
	conn.query('INSERT INTO posts VALUES ($1, $2)', [request.query.username, request.query.body]);
	response.end('<h1>Posted!</h1><a href="/">See posts</a>');
});


app.get('/my-password', function(request, response){
	if (!request.signedCookies.user){
		response.end('<h1>Not authenticated!</h1>')
		return;
	}
	conn.query('SELECT password FROM users WHERE username=$1', [request.signedCookies.user], function(err, res){
		if (err || !res.rows[0]){
    		console.error(err);
    		response.end('Error!');
    		return;
    	}
    	response.end(res.rows[0].password + '\n');
	});
});

app.get('/user/:username', function(request, response){
	var query = 'SELECT username, age FROM users WHERE username="' + request.params.username + '"';
	console.log('About to execute:\n' + query)
    conn.query(query, function(err, res){
    	if (err){
    		console.error(err);
    		response.end('<h1>Error!</h1>');
    		return;
    	}
    	var user = res.rows[0];
    	var attributes = [];
		for(var k in user){
			attributes.push('<strong>' + k + '</strong>: ' + user[k]);
		}
    	response.send('<h1>User info</h1>' + attributes.join('<br />'));
    })
});

app.listen(8080);