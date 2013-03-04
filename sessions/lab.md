CS132 Lab 4: Sessions in Node.js
================================

Project Description
-------------------
You have been hired by the British government to make sure some of 
their files can not be seen by non-citizens.

They are *for British eyes only*.

They have supplied you with their documents. They need you to
make a login page that protects their index page of
British documents.

Setup
------
Create a new directory and `cd` to it. The first thing
that we need to do is install Express. For that we enter: 

```
npm install express
```

This will install all of the dependencies needed for Express.

We've already initialized an Express application in the directory,
which is just a simple directory structure to get you going
quickly. (You could autogenerate this yourself with the `express` command,
if you'd installed Express globally with `-g`).
The main application is in `app.js`.

What are sessions?
-----------------
Sessions are temporary data associated with a user by a web application.
They typically last for between 15 minutes and several weeks, or until a user signs out.
Sessions are used by many web applications to keep track of
information from one request to another, especially authentication information.

HTTP is a stateless protocol: a server has no idea of knowing from
HTTP alone that the request it just received came from the same user as another request
5 minutes ago. For example, without sessions, a user would have to log in
to Amazon or Facebook for every page loaded!

There are multiple ways of implementing sessions, but the fundamentals are
the same: the server generates a random string, called the session ID, which
the client (the browser) then presents on subsequent requests -- like a temporary
password.

The method we will be using in this lab uses cookies.
Cookies are small pieces of data (a few kilobytes at most)
stored by the browser associated with some domain (such as `twitter.com`).
The browser sends the cookies associated with a domain along with
every request that is sent there in an HTTP header. Cookies
can be set via a response HTTP header or by Javascript.


Using Express Sessions
----------------
There are a couple of things that we need to set up sessions in Express,
as they are not included on the bare-bones stencil.

First we need to tell Express that we're going to use cookies.
So we add the following inside app.configure:

```
app.use(express.cookieParser());
```

This tells Express to parse the appropriate headers in the HTTP
request and make the data available to your application.

We'll use a very simple storage system for our sessions, called
a `MemoryStore`. (Technical: This maintains a data structure in the memory
of your process to keep track of state.) It's very simple, and
your sessions will be deleted whenever your Node application restarts.
More advanced applications would use
a database system to store this sort of information.

We also need to specify a time interval to clear the cache (remember that sessions are
temporary). 

To tell Express that we are going to be using sessions with a `MemoryStore`
we add the following snippet inside the `app.configure` method:

```
app.use(express.session({
  secret: 'some_secret_key',
  store: express.session.MemoryStore({reapInterval: 60000 * 10})
}));
```

Note that the reapInterval is 10 minutes (the value needs to be in milliseconds),
but it could be as long or as short as needed. (The secret key is used
to digitally sign session IDs so that clients can't try to impersonate other
session IDs or falsify other session data.)

With sessions enabled and configured you can use the `session`
property of the request object in any handler:

```
app.get('/what-is-my-name, function(req, res){
    res.end('Hello, ' + req.session.name);
});

app.get('/my-name-is', function(req, res){
	//this sets the "name" property of the session
	//to the name provided in the query paramters
	//e.g. http://localhost:8080/my-name-is?name=Kyle
	req.session.name = req.query('name');
})
```

Using Jade
-----

As you saw in the Node lab, writing HTML pages with Javascript becomes
unpleasant quickly as your page gets bigger. In order to build large
pages which incorporate data provided by your application, you should
use a templating language. These languages are mixes of HTML-like syntax
and code which allow you to write HTML with application-provided values
interspersed.

Rendering a page usually requires a template (usually stored in a file) and the data
which will be provided to it.

The British use a templating engine called <a href="http://jade-lang.com/">Jade</a>,
which is a somewhat simpler way of writing HTML. It omits the `<> </>` marks from
HTML and is instead based on indents.

For example, if you wanted to create a page with a header and an image you would write:

```
h1 This is my header
img(src="img.jpg")
```

The best way to learn some of the syntax is [this interactive
tutorial](http://naltatis.github.com/jade-syntax-docs/). (You'll
only need what they show in the first couple examples.)

The Jade files should go under the `views` directory.

If our file `doc1.jade` is in `views/doc1.jade` we can load
in on request by adding the following to `app.js`.

```
app.get('/doc1', function(req,res) {
  res.render("doc1.jade", {title: "Top Secret"});
});
```

Note that the first argument is the name of a template file in the `views`
directory, and the second is the data that will be rendered in the template.
(If you don't template in any variables you can just send it `{}`.)

(You should also know that Express automatically wraps your views in
the contents of `views/layout.jade`. This functionality is deprecated in
favor of using extension in the templating language itself, but
for our simple pages it's useful.)

You'll probably want to write templates for:

* The index page (where the user logs in with a form)
* The /documents directory
* An "access denied" page (super semantic kudos if you make the page return the right status code)

Forms
-----

You'll also be using forms with Node for the first time
in this lab. A form usually sends data to the server
using a POST request rather than the GET request
used for links and direct navigations.

You can recieve POST parameters in Node from the request object:

```
req.param('param_name')
```

This corresponds to the `name` attribute of a form field.

Your form (in Jade syntax) might look something like this:

```
form(method='post', action='/documents')
    | Username:
    input(name="username", type="text")
    br
    | Password: 
    input(name="password", type="password")
    br
    | Are you British?
    input(name="brit", type="checkbox")
    br
    input(value="Submit", type="submit")
```

And you should define a POST handler for `/documents`:

```
app.post('/documents', function(req, res) {
    //Read values from your form
    var username = req.param('username');
    var password = req.param('password');
    var brit = req.param('brit');

    //Show the list of documents or an error,
    //depending on whether they're British.
});
```

British Orders
---------------
The British government wants you to have people enter their name, password,
and click a checkbox confirming that they are indeed British (because no one lies on the internet).
You should store their credentials in their session, and when they try to access one 
of the documents, check whether or not they are British. If they are,
then you should display the "docN.jade" page they requested, otherwise you should
send them to an error page that you created.

You don't need to check whether their username and password are valid, though you
can if you like. As long as they promised they're British they're good to go.

Checkoff
-------------
When you are finished, call over a TA, and we will check you off. If you have questions, just ask! 

You can also get checked off during hours for the next week.
