<script src="./highlight.pack.js"></script>
<link rel="stylesheet" href="github.css"/>
<script>hljs.initHighlightingOnLoad();</script>
# Lab 2: Javascript and the DOM

### What you'll get to know

* Javascript
* Javascript's quirks
* the Document Object Model

### Installation

1. run `cs132_install lab1`. This will install the support code for the lab in `/web/cs132/yourLogin/lab1`
2. enter `http://your-login.proj132.cs.brown.edu/lab1` in your browser.

#### Warning: we're going to be giving you a lot of sample code in this lab, but we recommend *typing it in* instead of copy/pasting; it'll help you learn the syntax.

## What is Javascript?

From the [mozilla developer network](https://developer.mozilla.org/en-US/docs/JavaScript) (a great site for help with JS):

>JavaScript® (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, most known as the scripting language for Web pages, but used in many non-browser environments as well...

Javascript is the only language\* you can use in the browser to control the web page (e.g. make pop-ups, create an image slider, build infinite scroll). To control the web page, you use the DOM, which is an API for the browser's inner representation of the web page. 

\*google is working on [dart](http://www.dartlang.org) as an alternative, but pretend I didn't tell you that...

## What is the DOM?

From the w3c (the people who design web standards):

>The Document Object Model (DOM) is an application programming interface (API) for valid HTML and well-formed XML documents. It defines the logical structure of documents and the way a document is accessed and manipulated. In the DOM specification, the term "document" is used in the broad sense.
- [w3c "what is the DOM?"](http://www.w3.org/TR/DOM-Level-2-Core/introduction.html)

The DOM represents elements (i.e. `<a>`, `<div>`, `<p>`) as nodes in a tree. These nodes are available as objects in Javascript.

## What is jQuery?
JQuery is library that wraps the DOM and creates a simpler API for interacting with the webpage. Let's start with an example so you can get an idea of what we're talking about.
## Clicking A Link

### 1. Open `index.html` in your text editor. Add this in between the `<body></body>` tags

```
<a id="mylink" href="#">this is my link</a>
```

This markup defines a link (`<a>`) element with the text "this is my link" that goes to "#" (nowhere!). So lets make this link do something! Add this where it says `//this is where you can add inline javascript`:

```
var myLink = document.getElementById('mylink');

function clickMyLink (event) {
  alert("you clicked my link!");
}

myLink.onclick = clickMyLink;
```

What's going on here?

1. You ask the document for an element with the id `mylink` and save it in a variable `myLink`.
2. You tell the element that when it receives a "click" event, it should call the function `clickMyLink` and pass it an [event object](https://developer.mozilla.org/en-US/docs/DOM/event).
3. `clickMyLink` is going to use javascript's `alert` function to open a dialog window.

Now refresh the page in your browser and try clicking your link. Awesome. But lets see how to do this with jQuery. Go back to `index.html` and replace the javascript you just wrote with this:

```
function clickMyLink (event) {
  alert("you clicked my link!");
}

$(document).ready(function() {

  $('#mylink').on('click', clickMyLink);

});
```

What jQuery does here is abstract the process of selecting an element from the DOM. `mylink` can be identified in the DOM a few different ways:

Element | jQuery | DOM
--------|--------|----
`#mylink`| `$('#mylink)`| `document.getElementById('mylink')`
first `a` element | `$('a')[0]` | `document.getElementsByTagName('a')[0]`
first child of `body` | `$('body:first-child')` | `document.getElementByTagName('body')[0].firstChild()`

All selectors are not equal! These are listed in decreasing order of performance. jQuery is just wrapping the same DOM functions you would use on your own, and often has to do it less efficiently (because it's more generalized).

You're probably thinking--what's that `$(document).ready(function() {...`? Because the browser parses the page from top-to-bottom, and executes all the javascript as it works its way down, you can't ask jQuery to find elements that it doesn't know about yet (since they haven't been created yet). The solution? Wait for the browser to tell indicate that it's `ready`, and execute your code then (using an [anonymous function](http://helephant.com/2008/08/23/javascript-anonymous-functions/)).

## Events

So we saw events with `onclick` and jQuery's `on('click'`, but *what are events*? The DOM makes a ton of use of the [delagate event model](http://en.wikipedia.org/wiki/Event_model#Delegate_event_model), meaning that when something happens in the browser, it emits events, which can be picked up (and modified) by any code that's listening. This makes it easy for programmers to add additional code to a page without worrying about other scripts (e.g. plugins, bookmarklets, frames), and allows for really decoupled design. Let's see another example:

This is another syntax for add **event listeners** to an object (besides assigning to `on[eventname]`). It's nice because you can add and remove multiple listeners for the same event:
Add this HTML between your body tags:
`<div id="display">press a key</div>`
We're going to set up event listeners for `keyup`, so you can see when the user presses a key:

```
var display = document.getElementById('display');
document.addEventListener('keyup', function (event) {
  // the event object can tell us which key is pressed
  display.innerHTML = "you clicked key #" + event.keyCode;

});
```

Keys in javascript are identified by their **key codes** ([here's a ton of crazy info on it](http://unixpapa.com/js/key.html)). For example, the enter key is 13. So to only do something when the user hits "enter":

```
document.addEventListener('keyup', function (event) {
  
  if (event.keyCode === 13) {
    display.innerHTML = "you hit enter!";
  }
});
```

Notice that we're adding the event listener to `document`. The `document` is an element like any other, we're just adding the listener there because we want to call it on a keypress *anywhere on the page*. Events bubble up the DOM tree: if you click a button, you can listen to that event on any parent element of the button (just be careful, since a listener lower down may be able to stop the event from reaching yoU!)

`innerHTML` is the property of an element that contains a string of the HTML inside it. It's one of the ways to programatically change the content of a webpage (or element). Here's the same thing with jQuery:

```
var $display = $('#display'); // we prefix the variable with $ to remind ourselves it's a jQuery object
$(document).on('keyup', function (event) {
  $display.html("you just clicked: " + event.which); // which is the same as keyCode, it's just a cross-browser trick that jQuery does since IE<9 uses which...
});
```

For more info on events, check out [this page on quirksmode](http://www.quirksmode.org/js/introevents.html)

## Javascript Syntax

You've seen plenty of javascript so far, but without a proper introduction! Javascript is a pretty crazy language, at least because it supports procedural, object-oriented, and functional programming. Here's a little cheat-sheet.

### Variables

You declare a variable in javascript using `var`. Javascript has totally dynamic typing:

```
var lol = "laughing out loud"; // strings can be single or double quoted, nbd.
var satan = 666;
var floatNum = 665.0; // all numbers in js are type "number" (a float) so don't worry about it!
```

### Arrays & Objects (maps)
Arrays can be of mixed type, and are declared through a simple literaly syntax that's similar to Python or Ruby:

`var myArray = [ 1, 4, 'cool', myFunction ]; // myFunction is a function`
Working with arrays:

```
myArray[0] // 1
myArray.length // 3
myArray.slice(0,2) // [ 1, 4, 'cool' ]
myArray.concat(['horse']) // [ 1, 4, 'cool', myFunction, 'horse']
```

And there's [a lot more](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array)

An **object** in javascript is an associative array--a dictionary/hashmap/map, etc. They're easy to use, and can also have mixed types:

```
var csStudent = {
  name: 'CS Student',
  age: 24,
  sex: 't',
  location: { // you can have nested objects!
    city: 'Providence',
    state: 'Rhode Island'
  }
};
```

Write a similar object for yourself in the `<script>` tags in your index.html. Now open up your page in the browser in check out the javascript console [firefox instructions](https://developer.mozilla.org/en-US/docs/Tools/Web_Console?redirectlocale=en-US&redirectslug=Using_the_Web_Console), [chrome instructions](https://developers.google.com/chrome-developer-tools/docs/overview). Now typethe name of the variable you just made into the console. You should see the name come up with a little arrow to let you check out the object. You can see all the properties you just defined.

There are two ways to access a property on an object:

```
csStudent['name'] // 'CS Student'
```
or

```
csStudent.name // 'CS Student'

```

FYI: dot notation only works with object properties that aren't keywords and are single words. You can remove a property by using `delete csStudent.name`, but often you really just need to set it to `undefined` (javascript's internal representation of an undefined property), so `csStudent.name = undefined;`. 

### Printing to the Console
If you open up the javascript console (described above), you can print to it by passing a string to `console.log`. Try this in your code with the console open:  `console.log(csStudent);`

### `==` vs. `===`
One of the most common bugs in javascript is getting `==` confusing with `===`. Javascript does *type coercion*, so `1 == "1"` is `true`, but `1 === "1"` is false, since `1` is a `number` and `"1"` is a `string`. It's a best practice to always use `===` so you don't get any surprises.

### Flavors of False
In javascript, variables are "falsy" or "truthy", meaning that you can do `if (myNonBooleanVariable)...`. Here are the main falsy values.

####1. `null`
an instant classic. This is usually used to indicate a nonexistent object (null is actually of type `object`), which leads to some confusing things like this:

```
var bigMistake = null;

if (typeof bigMistake === 'object') {
  alert("javascript is weird!");
}
```

What happens if you put that in your `<script></script>` tags. Is that what you'd expect?

####2.`undefined`
When you try to access a property on an object or a variable that isn't defined, you'll get the value `undefined`. Say you have this:

```
function sayHi(name) {
  if (name !== undefined) {
    alert("Hello " + name);
  }
}
sayHi() // name is undefined
sayHi("CS Student"); // name is "CS Student", you'll get an alert
```

If you're accessing a property and an object and you're not sure if it'll be there, you should check for `undefined`:

```
var myObj = {}; // empty object

if (myObj.name === undefined) {
  console.log("no name!"); // this will always be called
}
```

#### 3.`false`
False isn't nothing! But it is **not**. Javascript lets you do this:

```
if (foo) {
  // if foo is "truthy"
} else {
  // if foo is "falsy"
}
```

So as with `undefined` and `null`, `foo = false` would be *falsy*. So is `0`. This is all important because you might want to have input that's falsy but not nonexistent. So you'd only want `null` or `undefined`. This is one case where you can get away with loose comparison (`==`):

```
if (parameter != null) {
  // if parameter is null or undefined, but not 0 or false
}
```


### Surprisingly Truthy
Just an FYI: empty arrays an objects are always `true`. This is good to know for jQuery, where if you select something that doesn't exist, you'll still end up with a jQuery object (which is truthy). So:

```
var $nonExistent = $("#my-box.non-existent");

if ($nonExistent) {
  console.log("true!");
}
```

Just keep this in mind when you're using jQuery. When you use the DOM itself, you'll always get `null` if the DOM can't find what you're looking for.

### Functions
Functions are first-class citizens of javascript; they're objects. You can defined properties on them, and they're capable of inheritence. Here's some [advanced information about javascript functions](http://www.quirksmode.org/js/function.html). The gist is:

#### Declaring Functions
There are two normal ways:

```
var myFunction = function (arg1, arg2, arg3) { ... }; 
// or
function myFunction (arg1, arg2, arg3) { ... };
```

The first is called an anonymous function, which you're assigning to a variable called `myFunction`. The second is a named function *called* `myFunction`. They both declare the function in the same scope. Since a function is just an object, you can declare one with the `Function` constructor, but this is pretty slow, so don't try that unless you're doing some weird runtime declaration... don't worry about it.

#### Calling Functions and `this`
Javascript has some cool ways to call functions. Of course, you can call a function by name, or dynamically on an object:

```
var fn = "foo";
obj[fn](args); // you could assign fn at runtime
```

But what is `this` in a js function? Most of the time, `this` is the function itself. Remember that functions can have properties, so that's kind of useful

```
function Foo(name) {
  this.name = name;
  alert(this.name);
}
```

If you want, you can call a function with a different `context`, meaning that `this` can be set to whatever object you want. You do that with [`call`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/call) and [`apply`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/apply):

```
foo.apply(otherObj, [ arg1, arg2, arg3 ]); // call foo where this === otherObj
foo.call(otherObj, arg1, arg2, arg3); 
```

The difference is how you supply arguments to the function you're calling. `apply` takes an array, call takes individual arguments.

#### Scoping
Javascript scope is really crazy. The only way you can declare scope is with a function. So `if` statements, `while` loops, etc. do not create a scope (like they do in C). Javascript also has [lexical scoping](http://stackoverflow.com/questions/1047454/what-is-lexical-scope), which really means that what variabels in an outer scope are available in an inner scope, which lets you do this:

Try adding this to your `<script>` tag:

```
var display = document.getElementById("display");

function greeter(name) {
  return function sayHi() {
    display.innerHTML = "hi " + name;
  }
}

var greetMe = greeter("your name here");
greetMe();
```

Notice how the function returned by `greeter` has a reference to the `name` variable in `greeter's` scope? That's lexical scoping. `sayHi` is what's called a **closure**. (siiiiiiiicckkkk).

#### Inheritence
Javascript doesn't do inheritence the same way C/Java/Python/Ruby does (classically). It uses *prototypical* inheritence. It looks a little bit confusing (considering there's no `inherits` or `extends` keyword. There aren't even classes! But it's actually a really simple concept: when you call a method on an object, javascript goes up that object's prototype chain (its parents' prototypes) looking for a method with that name. While that sounds a lot like classical inheritence, it's actually a lot simpler, since it doesn't require any classes or interfaces. 

You don't really need multiple inheritence since you can inherit from any list of prototypes in any order you want; they don't have to implement the same methods! Try this out:

Put this in your `<script>` tag:

```
// this is the constructor
function Friend (age, sex, location) {
  this.age = age;
  this.sex = sex;
  this.location = location;
}
// let's define a method for Friend; the prototype is just an object
Friend.prototype = {

  info : function () {
    return this.age + "/" + this.sex + "/" + this.location;
  }

};
```

Now write this somewhere below in your script tag (assuming you still have the `<div id="display"></div>` in your HTML:

```
var $display = $('#display');
var oldMan = new Friend(90, "m", "Providence);
$display.html(oldMan.info());
```

But what if we want to create an object that inherits from `Friend`, say, a `CyberFriend`? Since we're working with Functions, calling the super-object is as easy as calling a function with the context (`this`) set to our new object:

```
function CyberFriend (age, sex, location, screenname) {
  Friend.call(this, arge, sex, location); // call the parent (super)
  this.screenname = screenname;
}
```

Now we want to set CyberFriend's prototype to an instance of Friend's `prototype`. We don't want to use it's `prototype` because then we'd be messing with `Friend`. So we create a dummy function with a blank constructor so we can instantiate a new `Friend` prototype:

```
function dummy() {}; // blank function
dummy.prototype = Friend.prototype;

CyberFriend.prototype = new dummy(); // a new instance of the prototype
CyberFriend.prototype.constructor = CyberFriend; // that's the function that the new keyword calls
```

Nice! Now we've got a CyberFriend using it's constructor but Friend's prototype. How do we add new methods? Just define them on the prototype object:

```
CyberFriend.prototype.profile = function () {
  return this.info() + "/" + this.screenname;
}
```

Now if you've been following along, you should be able to do this:

```
var myCyberBuddy = new CyberFriend(19, "P", "Cyberspace", "kevinm1tn1k");
$display.html(myCyberBuddy.profile()); 
```

### Other Syntax

#### Conditionals
Javascript conditionals are a lot like C. There is `if`, `else if`, and `else`. We already talked about truthy and falsy values. Just know that you can convert a variable to a boolean type with `!!`(not not), so `!!1 === true`. This is a good way to determine if a value is "truthy" or "falsy" (just do `console.log(!!myValue);`.

Javascript also has a switch statement. This isn't super popular:

```
function legal (age) {
  var ableTo = [];
  
  switch (age) {
    case 18:
      ableTo.push('vote', 'fight', 'get real estate license');
      break;
    case 21:
      ableTo.push('drink', 'patronize adult establishments');
      break;
    case 65:
      ableTo.push('retire');
      break;
    default:
      ableTo.push('be free');
  }
  
  return ableTo;
}
```

#### Loops
Similar deal here. It looks just like C. The only difference is how you can iterate over an object:

```
for (var key in object) {
  console.log("key: " + key + " value: " + object[key]);
}
```

You can use that syntax with arrays too, but it's pretty pointless, since `key` would just be the index in the array, and this type of loop is slower. Javascript also has `while` loops just like C/java, and you can use `++/--` unary operators on values. Javascript also has a `break` keyword for getting out of a loop and a `continue` statement for going to the next iteration.

## Cool Demo
Let's use some of your javascript knowledge. Get some HTML like this:



	<h1>Age Store</h1>
	<label for="name">please input your name:</label>
	<input type="text" id="name" />
	
	<div id="input" style="display:none;">
	  <label type="text" id="age" />
	  <button id="save">save</button>
	</div>
	
	<div id="result" style="display:none;">
	  Your age: <span id="display"></span>
	</div>
	
	<button id="find">search</div>


We're going to make a widget where you can save ages by name. We want the user to input a name; if we find it, we'll show the age. Otherwise, we'll show an input for the user to give us the age. Notice that both the `result` and `input` div's are set to `display:none;`. That's CSS's way of saying that they're hidden.

First, we need to wrap our code as a callback from jQuery's `ready()` event. Then we want to save references to the name input, the age input, and the result box.

```
$(document).ready(function() {

  var $nameInput = $('#name');
  var $ageInput = $('#age');

  var $inputBox = $('#input');
  var $resultBox = $('#result');
  var $display = $('#display');
  
  var $searchBtn = $('#find');
  var $saveBtn = $('#save');

  var data = {}; // this is where we store the age data

  function showAge (name) {
    $inputBox.hide();
    $display.html(data[name]);
    $resultBox.fadeIn();
  }

  // now let's set up a listener for when someone searches
  $searchBtn.on('click', function (event) {
    var name = $nameInput.val() // get a value of an input using jQuery

    // check if it's in the data object:
    if (data[name] !== undefined) {
      showAge(name);
    } else {
      $resultBox.hide(); // in case it was showing before

      $inputBox.fadeIn();
      $saveBtn.on('click', function (e) {
        data[name] = $ageInput.val();
        showAge(name);
      });

    }

  });
```

Great! When you've gotten to this stage in the lab, ask your TA to check you off.


## Javascript Resources

### Beginner
* [Kahn Academy CS](http://www.khanacademy.org/cs/tutorials/user-interaction)
* [Codecademy Javascript](http://www.codecademy.com/tracks/javascript)

### Intermediate
* [Mozilla Developer Network: Javascript](https://developer.mozilla.org/en-US/docs/JavaScript)
* [W3 School Javascript](http://www.w3schools.com/js/default.asp)
* [Intro to Javascript For Coders](http://madebyevan.com/jsintro/)
* [Javascript Garden](http://bonsaiden.github.com/JavaScript-Garden/)

### Advanced
* [Quirksmode Javascript](http://www.quirksmode.org/js/contents.html)
* [John Resig: Learn Advanced Javascript](http://ejohn.org/apps/learn/)
* [Douglas Crockford: Javascript](http://javascript.crockford.com)

### jQuery
* [jQuery Website](http://jquery.com)
* [useful jQuery source browser](http://www.james.padolsey.com/jquery/)
* [How jQuery Works](http://learn.jquery.com/about-jquery/how-jquery-works/?rdfrom=http%3A%2F%2Fdocs.jquery.com%2Fmw%2Findex.php%3Ftitle%3DTutorials%3AHow_jQuery_Works%26redirect%3Dno)



