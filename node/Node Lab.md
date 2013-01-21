# CS132 Lab Three: Node.js
In this lab, you will learn how to write a basic application using [Node][node], how to find and install new modules using [npm][npm], and how to use a simple web application framework called [Express][express].

  [node]: http://nodejs.org
  [npm]: http://npmjs.org
  [express]: http://expressjs.com

## Setup
Create a new directory for your project in your `cs132` directory. It does not need to be web accessible -- Node will act as your web server.

## What is Node?
Node, often stylized as Node.js, is a scripting language interpreter -- like the Python and Ruby interpreters -- that allows you to write very fast, highly-scalable network applications in JavaScript. It uses [V8][v8], the JavaScript engine used by Google Chrome, and in addition to allowing you to build highly-scalable web apps, gives you the ability to potentially reuse the same JavaScript code on both the client and the server.

  [v8]: http://code.google.com/p/v8/

## Getting Started with the REPL
The Node [REPL][repl], or read--eval--print loop, is a great way to play around with Node's features without having to create any scripts. To start the REPL, just type `node` at the command line.

  [repl]: http://en.wikipedia.org/wiki/Read–eval–print_loop

    >

You will be greeted with a fairly unenthusiastic command prompt; but unenthusiastic though it may be, there is much power hiding behind the caret. For starters, type out "2 + 2" and hit enter.

    > 2 + 2
    4
    
Voilà! Node evaluated the expression, and printed the return value to the console. If instead you had typed:

    > console.log(2 + 2)
    4
    undefined

... you now see "undefined" printed as the last line, but you still see 4. This is because the `console.log(...)` function printed the value you gave it, but has an undefined return value, which Node printed out for you after all expressions had been evaluated.

You can, of course, do more complex things:

    > for (var i = 0; i < 5; i++) console.log('Hello, world!');
    Hello, world!
    Hello, world!
    Hello, world!
    Hello, world!
    Hello, world!
    undefined

Anything that's valid JavaScript can be entered into the Node REPL, and with any luck, you should get the result you expect. Play around with the REPL and see what else you can make it do. To exit, press Ctrl + D.

## Writing Your First Application
Create a new file -- call it, for instance, "demo.js" -- and add the following to it:

    console.log('Hello, world!');

You can run this application with the command `node demo.js` in the terminal (**not** the REPL), and you should see the phrase "Hello, world!" printed to the command line. Easy, right?

Let's try to do something a little bit more interesting, though. Node gets a lot more fun when you start using additional *modules*.

### Importing Modules with require(...)
Node has a built-in function called `require(...)` that's used for importing external JavaScript modules. You can pass in either the name of a module (which incurs a search of your app's local `node_modules` directory, and any globally-installed or built-in modules), or an explicit path to a JavaScript file. For instance, if I wanted to import the built-in filesystem module, named `fs`, I would do:

    var fs = require('fs');

You must always assign the return value of `require(...)` to a local variable that represents the module. This is a tremendously useful feature, because you can tailor the namespace of a module's functions to fit your project. For example, if I do the above, I can access the filesystem functions as (e.g.) `fs.chown(...)`, but if I instead did:

    var theFilesystem = require('fs');

... I would access the filesystem functions as `theFilesystem.chown(...)`.

### Example: A "Meta" Application
Let's get a little bit meta, and write an application that prints out its own source. Enter this code into your "demo.js" file, and then try running it with `node`:

    var fs = require('fs');
    
    fs.readFile('demo.js', function(err, data){
        console.log('The contents of demo.js is:\n');
        console.log(data);
    });

You should see something a little bit strange: the contents of your file is represented as a sequence of hex digits, not a string. This is because, by default, Node uses `Buffer` objects when interacting with data. JavaScript historically has a very hard time dealing with binary data, and this is Node's answer to the problem (fun fact!).

You can fix the problem in a couple of ways -- one of them being that the `fs.readFile(...)` function takes an optional encoding parameter -- but it's just as easy to convert your buffer to a string once it's handed to you.

    var fs = require('fs');
    
    fs.readFile('demo.js', function(err, data){
        console.log('The contents of demo.js is:\n');
        console.log(data.toString('utf8'));
    });

That's better. Note that, instead of `'demo.js'`, you could also use the magic `__filename` constant (which is always the full filesystem path to the current JavaScript file) to simplify things a little.

    var fs = require('fs'),
        path = require('path');
    
    fs.readFile(__filename, function(err, data){
        console.log('The contents of', path.basename(__filename), 'is:\n');
        console.log(data.toString('utf8'));
    });

Note that I also included the `path` module so that I could print out just the filename of the JavaScript file, not its full path.

## Thinking Asynchronously
One of the ways that Node achieves its speed is through its event-driven architecture. In Node, JavaScript always executes in a single thread, so you never have to worry about locking or traditional concurrency issues. However, by encouraging an event-driven development model, Node allows applications to take full advantage of the main thread's idle time to interleave tasks together, which means it's actually faster than some multi-threaded application servers.

The way Node accomplishes this is with *callbacks*. For pretty much any operation for which CPU time is not the bottleneck -- mostly filesystem and network operations -- the built-in functions require that you pass in a callback function. What this is saying is that those functions return immediately, freeing up your program to do other things. Node will then go off and do the work for you in the background, and when it's ready, it'll call your callback with the results.

You can write callbacks inline:

    module.doSomething(param1, param2, function(result){
        // handle the results
    });

... or as ordinary functions:

    function handleTheResultDude(result){
        // handle the results
    }

    // note: just the name of the function, no parentheses
    module.doSomething(param1, param2, handleTheResultDude);

The asynchronous nature of callbacks can be a little confusing at first -- consider, for example:

    var fs = require('fs');
    
    fs.readFile('/path/to/a-really-big-file.js', function(err, data){
        console.log('Done!');
    });
    console.log('Hello, world!');

The output of this program would be:

    Hello, world!
    Done!

Even though the "Hello, world!" line comes *after* the call to `fs.readFile(...)`, it executes *before* the file has finished reading -- `fs.readFile(...)` returns immediately, and the callback isn't called until all data from the file has been loaded into memory. The power of this should become immediately apparent: even though *you're* waiting for the contents of the file, your program isn't, and it can continue running other tasks in the meantime.

Asynchronous programming can be a little tricky to get the hang of at first, so we'll have a help session on it later. For now, just remember that your callback code doesn't happen until events complete.

## The Simplest of Web Servers
Let's try something else. Node includes an `http` module which has a simple (but relatively fast) web server component. Create a new file called "server.js", enter the following code, and run it:

```javascript
var http = require('http');
    
var server = http.createServer(function(request, response){
    console.log('- Request received:', request.method, request.url);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<h1>Hello, world!</h1><p>Welcome to my server.</p>');
});
    
server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});
```

With the server running, visit [http://localhost:8080/](http://localhost:8080) in your web browser. You should see a simple "Hello, world!" page. Try visiting different paths on the same server (e.g., [http://localhost:8080/foo/bar](http://localhost:8080/foo/bar)) and you should see the same thing. You can quit your server by pressing Ctrl + C.

Every request is handled by the same callback you pass in to `http.createServer(...)`. You can add some logic to the callback to do some interesting things:

```javascript
var http = require('http');

var server = http.createServer(function(request, response){
    console.log('- Request received:', request.method, request.url);
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
    console.log('- Server listening on port 8080');
});
```

**Task 1:** Create a simple, but cool, web service. A random number generator might be a good start. You can check out the [Node docs][docs] for all of the built-in stuff you have access to. You also have access to most of the stuff that works in common web browsers.

  [docs]: http://nodejs.org/api/

## Getting More Modules with npm
Node is more fun when you add more modules. To make the process a little easier, Node comes with a tool called `npm`, which stands for Node Packaged Modules. You can use `npm` to install modules from a global repository.

    npm install moduleName

The best part is, modules installed this way with `npm` get installed into a local `node_modules` directory in your current folder. That means that each application can have its own set of dependencies that travel with it, and you don't need root privileges to install new modules.

Let's spruce up our server code with some prettier logging. There's a great module by [Marak Squires][marak] called [colors][colors] that lets you print colored text to the console. Install it like this:

    npm install colors

Then require it in your "server.js" code, and add it to some of your logs. For example:

    var http = require('http'),
        colors = require('colors');
    
    var server = http.createServer(function(request, response){
        console.log('- Request received:', request.method.cyan, request.url.underline);
        // your code here...
    });
    
    server.listen(8080, function(){
        console.log('- Server listening on port 8080'.grey);
    });

Note the uses of `.grey`, `.cyan`, and `.underline` on the strings echoed to the console. Rerun the server, and you should notice some subtle, but welcome, changes!

  [marak]: http://marak.com
  [colors]: https://github.com/marak/colors.js

`npm` has [a large repository][npm] of modules that you can browse. You can also just Google around for Node modules, and more than 95% of the time, the finished products will be on `npm` for you to install. Play around, and see what you can find!

**Task 2:** Find one cool module, and add a feature to your web server that uses it.

## Using Express
The built-in web server is great, but it's very barebones: you get requests, and you return responses, and that's it. There are a lot of features that are fairly common to most web applications -- cookies, sessions, routes, templates, etc. -- that are ordinarily provided by web application frameworks. The Node community has a great one, and it's called Express.

    npm install express

You'll notice that the output of the `npm install` command for Express is *much* longer than for `colors`. This is because Express has a lot of dependencies, which `npm` handles for you automatically. Nice.

Go ahead and create a new file called "server2.js" -- it can either be blank, or you can just make a copy of your existing "server.js" and adjust it to work with Express.

The first step is to require Express, and create an app:

    var express = require('express');
    var app = express();

You can then replace your single `http.createServer(...)` invocation with multiple invocations of `app.get(...)`, each one representing a path that you want to use. For instance, an Express-using example of the original "server.js" would look something like this (note the use of Express convenience methods):

```javascript
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

app.get('*', function(request, response){
    console.log('- Request received:', request.method.cyan, request.url.underline);
    response.send('<h1>Hello, world!</h1><p>Welcome to my server.</p>');
});

app.listen(8080, function(){
    console.log('- Server listening on port 8080'.grey);
});
```

A little bit longer, but simpler to understand, and more extensible. Note that the `server.listen(...)` line has been replaced with `app.listen(...)`.

It's also important to note that the order of *routes* (the URLs of incoming requests, i.e., `/foo/bar`, `*`, etc.) is significant: when a new request comes in, they'll be checked in order from top-to-bottom of your script. So, for example, because the `*` route matches everything, if you were to define it before `/foo/bar`, your handler for `/foo/bar` will never be called. However, by defining `/foo/bar` first, you ensure that the request won't erroneously be caught by your "catch-all" route.

### Adding Features
Express packs in a ton of handy features. For instance, let's say we want to expose the source of our server to the outside world (generally not recommended, but hey, what's the harm?). Response objects now have a `sendfile(...)` method, which can be used like so:

    app.get('/source', function(request, response){
        console.log('- Sending source'.yellow);
        response.sendfile(__filename);
    });

Nifty. What if we wanted to make it a little safer, by requiring a username and password? Express provides a number of *middleware* that provide just such features. The `basicAuth` middleware should do what we want. Here, we pass it in as a parameter to `app.get(...)` to restrict it to just `/source`, but you can also use middleware globally with `app.use(...)`:

    app.get('/source', express.basicAuth('joe', 'foobar'), function(request, response){
        console.log('- Sending source'.yellow);
        response.sendfile(__filename);
    });

Express has a ton of cool middleware, most of which is [documented in the API reference][express-api].

  [express-api]: http://expressjs.com/api.html

**Task 3:** add a feature to your web server that uses Express or [Connect][connect] (the layer that sits under Express) middleware. If you're short on ideas, adding a static file server might be a good way to go.

  [connect]: http://www.senchalabs.org/connect/

## Check Off
At this point, you've created a very basic web application with Node and Express. You can now take on the task of installing new modules with `npm`, and add features to do interesting things.

Add any additional functionality you feel like adding, and then call a TA over to check you off.

## Extra Fun: Writing Your Own Module
There are plenty of tutorials out there (including [this über-basic one][basics]) on what it takes to write your own Node module, and it's not very hard. There are basically three things you need to do:

  [basics]: http://howtonode.org/creating-custom-modules

1. Create a folder for your module inside the `node_modules` folder.
2. Write a `package.json` file for your module. `npm help json` is a full reference, but you really just need the `name`, `description`, and `main` properties if you aren't sharing your module anywhere.
3. Write your code, and then export the interface by assigning to the `exports` object. For example, if I have a module called "foomod":

        function doSomethingCool(name){
            console.log('Hi,', name + '!');
        }
    
        // this line means people can call foodmod.doSomethingCool(...)
        exports.doSomethingCool = doSomethingCool;

If you have time left, see if you can write your own simple module. It's fun!