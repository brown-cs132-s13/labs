CS132 Lab 4: Sessions in Node.js
================================
In this lab you will write a basic web application in <a href="http://nodejs.org/">Node</a> that will rememeber its users after they sign in.

Setup
------
Create a new directory in your cs132 directory and `cd` to it. The first thing that we need to do is install Express. For that we enter: 

```
npm install express
```

As we learned earlier, this will install all of the dependencies needed for Express,
as well as adding it to your path. Next we can initialize an Express application in
the directory. This will just set up a simple directory structure to get you going
quickly:

```
express
```

What are sessions?
-----------------
Sessions are temporary data associated with a user by a web application.
They last for between 15 minutes and several weeks, or until a user signs out.
Sessions are used by many web applications to keep track of
information from one request to another, especially authentication.
HTTP is a stateless protocol: a server has no idea of knowing from
HTTP alone that the request it just got came from the same user as another
5 minutes ago. For example, without sessions, a user would have to log in
to Amazon or Facebook for every page loaded!

There are multiple ways of implementing sessions, but the fundamentals are
the same: the server generates a random string, called the session ID, which
the client then presents on subsequent requests -- like a temporary
password.

The method we will be using in this lab uses cookies.
Cookies are small pieces of data (a few kilobytes at most)
stored by the browser associated with some domain (such as `twitter.com`).
The browser sends the cookies associated with a domain along with
every request that is sent there in an HTTP header. Cookies
can be set via a response HTTP header or by Javascript.

Project Description
-------------------
You have been hired by the British government to make sure some of 
their files can not be seen by non-citizens.

In other words, for British eyes only.

They have supplied you with their documents. They need you to
make a login page that protects their index page of
British documents.

#TODO?

You can find the documents in `/course/cs132/pub/lab5`.

Using Jade
-----

As you saw in the Node lab, writing HTML pages with Javascript becomes
unpleasant quickly as your page gets bigger. In order to build large
pages which incorporate data provided by your application, you should
use a templating language. These languages are mixes of HTML-like syntax
and code which allow you to write HTML with application-provided values
interspersed.

The British use a templating engine called <a href="http://jade-lang.com/">Jade</a>,
which is a somewhat simpler way of writing HTML. It omits the `<> </>` marks from
HTML and is instead based on indents.

For example, if you wanted to create a page with a header and an image you would write:

```
h1 This is my header
img(src="img.jpg")
```

To see an example, go to the <a href="http://jade-lang.com">Jade</a> website.
The Jade files should go under the views directory that Express has so generously
made for us. If our file `doc1.jade` is in `views/doc1.jade` we can load
in on request by adding the following to `app.js`.

```
app.get('/doc1', function(req,res) {
  res.render("doc1.jade", {title: "Top Secret"});
});
```

Passing the title along will display it at the top of the page (A Jade feature).
You may also pass along an empty Javascript object "{}".

Express Sessions
----------------
There are a couple of things that we need to setup sessions in Express,
as they are not included on the bare-bones stencil. In Express, when we
need to have a memory store in which to store the session information
and we also need to specify a time interval to clear the cache (remember
that sessions are semi-persistent). I like to create a temporary
variable called MemStore to do this:

```
var MemStore = express.session.MemoryStore;
```

Remeber, earlier we said that this implementation used cookies.
Thus we need to tell Express that we are going to use cookies.
So we add the following inside app.configure:

```
app.use(express.cookieParser());
```

Then we need to tell the app config that we are going to be using sessions.
To do this we add the following snippet inside the app.configure method:

```
app.use(express.session({
  secret: 'secret_key',
  store: MemStore({reapInterval: 60000 * 10})
}));
```

Note that I made the reapInterval 10 minutes (the value needs to be in miliseconds),
but I could have made it as long or as short as I wanted. Also, notice 
how I used my temporary variable <b>MemStore</b>. This is for cosmetic purposes only.
You could have written:

```
app.use(express.session({
  secret: 'secret_key',
  store: express.session.MemoryStore({reapInterval: 60000 * 10})
}));
```

Now Express knows that we are going to be using sessions, so we can use them freely.
Before we do this, we need to know how to recieve post parameters from node.
To do this we need to access the request object:

```
req.param('param_name')
```

Knowing this, if we want to store a post param in the session, all we have to do is:

```
req.session.param_name = req.param('param_name');
```

The next time a request comes in, we can access that param once again through the request object

```
var previous_param = req.session.param_name
```

British Orders
---------------
The British government wants you to have people enter their name, password,
and click a checkbox confirming that they are indeed British (because no one lies on the internet).
You should store their credentials in their session, and when they try to access one 
of the documents, check whether or not they are British. If they are,
then you should display the "docN.jade" page they requested, otherwise you should
send them to an error page that you created.

Checkoff
-------------
When you are finished, call over a TA, and we will check you off. If you have questions, just ask! 

You can also get checked off during hours for the next week.
