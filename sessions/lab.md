CS132 Lab 4: Sessions in Node.js
================================
In this lab you will write a basic web application in <a href="http://nodejs.org/">Node</a> that will rememeber it's users after they sign in using the <a href="http://expressjs.com/">Express</a> Framework.

Setup
------
Create a new directory in your cs132 directory and change to it. The first thing that we need to do is install express. For that we enter: 

> <b> npm install express </b>

As we learned earlier, this will install all of the dependencies needed for express, as well as adding it to your path. Next we need to initialize a express application in the directory. Again, this should be review from the Node.js lab.

> <b> express </b>

This will add everything needed for the bare-bones web application.

What are sessions?
-----------------
Sessions are a semi-permanent information interchange between a user and the web application itself. Sessions are used by the majority of modern web applications to keep track of relevant information from one request to another. For example, without sessions, the user would have to log in to amazon or facebook at every page request to make sure that the user has the right to view the information on the page. 

There are multiple types of ways of mimicing sessions. The method we will be using today makes use of Cookies. Cookies are little chunks of persistent information from the web application that the browser allows to be stored locally on the computer. Each cookie is web application specific, and can store any information the user has given the web application. In the case of sessions, it will store a unique number called a session ID which will be sent back to the web application on request to make sure the user has the appropriate credentials.

Project Description
-------------------
You have been hired by the British government to make sure some of their files can not be seen by non citizens. In other words, for British eyes only. They have supplied you with the files. They need you ta make a login page that links the their index page of the British documents. You can find the jade files in /course/cs132/pub/lab5

Jade
-----
The British use a templating engine called <a href="http://jade-lang.com/">Jade</a> which is a cleaner way of writing html. Jade is quite simple. It removes the <> </> tags from html and is instead indent based. For example, if you would like to create a webpage with a header and an image you would write:

> <b>h1 This is my header <br/> img(src="img.jpg")</b>

To see a go example, go to the <a href="http://jade-lang.com">Jade</a> website. The Jade files should go under the views directory that <a href="http://expressjs.com/">Express</a> has so generously made for us. If our file "doc1.jade" is in "views/doc1.jade" we can lode in on request by adding the following to app.js.

> <b>app.get('/doc1', function(req,res) {<br/> res.render("doc1.jade", {title: "Top Secret"}) :<br/> });</b>

Passing the title along will display it at the top of the page (A Jade feature). You may also pass along an empty Javascript object "{}".

Express Sessions
----------------
There are a couple of things that we need to setup sessions in express, as they are not included on the bare-bones stencil. In Express, when we need to have a memory store in which to store the session information and we also need to specify a time interval to clear the cache (remember that sessions are semi-persistent). I like to create a temporary variable called MemStore to do this:

> <b> var MemStore = express.session.MemoryStore; </b>

Remeber, earlier we said that this implementation used cookies. Thus we need to tell Express that we are going to use cookies. So we add the following inside app.configure:

> <b> app.use(express.cookieParser()); </b>

Then we need to tell the app config that we are going to be using sessions. To do this we add the following snippet inside the app.configure method:

> <b> app.use(express.session({secret: 'secret_key', store: MemStore({<br/>reapInterval: 60000 * 10<br/>})}));</b>

Note that I made the reapInterval 10 minutes (the value needs to be in miliseconds), but I could have made it as long or as short as I wanted. Also, notice how I used my temporary variable <b>MemStore</b>. This is for cosmetic purposes only. You could have written:

> <b> app.use(express.session({secret: 'secret_key', store: express.session.MemoryStore({<br/>reapInterval: 60000 * 10<br/>})}));</b>

Now Express knows that we are going to be using sessions, so we can use them freely. Before we do this, we need to know how to recieve post parameters from node. To do this we need to access the request object:

> <b> req.param('param_name') </b>

Knowing this, if we want to store a post param in the session, all we have to do is:

> <b> req.session.param_name = req.param('param_name');</b>

The next time a request comes in, we can access that param once again through the request object

> <b> var previous_param = req.session.param_name </b>

British Orders
---------------
The British government wants you to have people enter their name, password, and click a checkbox confirming that they are indeed British (because no one lies on the internet). You should store their credentials in their session, and when they try to access one of the documents, check whether or not they are British. If they are, then you should display the "docN.jade" page they requested, otherwise you should send them to an error page that you created.

Checkoff
-------------
When you are finished, call over a TA, and we will check you off. If you have questions, just ask! 