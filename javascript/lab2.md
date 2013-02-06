# Lab 2: Javascript and the DOM

> This lab is split very differently between concentrators and non-concentrators: non-concentrators have to pick up programming *and* Javascript. Concentrators familiar with other languages should be able to pick up Javascript (mind its quirks!) fairly quickly.

## For non-concentrators

You'll be taking a guided tour of the Codecademy courses on Javascript and jQuery. Note that the order of those two courses on Codecademy is reversed from how we present it here (we'll do jQuery after Javascript) -- so there may be a few notes that don't quite make sense. Also don't hold back using your hints, as one or two use things we haven't covered before (such as CSS's nth-child selector).

We recommend getting an account there in order to save your work more easily.

[Codecademy &mdash; Getting Started with Programming](http://www.codecademy.com/courses/getting-started-v2?curriculum_id=506324b3a7dffd00020bf661)

* [Getting to know you](http://www.codecademy.com/courses/getting-started-v2/0?curriculum_id=506324b3a7dffd00020bf661#!/exercises/0)
* [Make the computer think!](http://www.codecademy.com/courses/getting-started-v2/2?curriculum_id=506324b3a7dffd00020bf661#!/exercises/0)
* [Variables](http://www.codecademy.com/courses/getting-started-v2/4?curriculum_id=506324b3a7dffd00020bf661#!/exercises/0)

[Codecademy &mdash; Javascript for Beginners](http://www.codecademy.com/tracks/javascript)

* [Functions in Javascript](http://www.codecademy.com/courses/javascript-beginner-en-6LzGd?curriculum_id=506324b3a7dffd00020bf661)
* [For loops](http://www.codecademy.com/courses/javascript-beginner-en-NhsaT?curriculum_id=506324b3a7dffd00020bf661)
* [Arrays and Objects](http://www.codecademy.com/courses/javascript-beginner-en-9Sgpi?curriculum_id=506324b3a7dffd00020bf661)
* [Objects I](http://www.codecademy.com/courses/spencer-sandbox?curriculum_id=506324b3a7dffd00020bf661)

[Codecademy &mdash; jQuery](http://www.codecademy.com/tracks/jquery)

* [DOM & jQuery](http://www.codecademy.com/courses/web-beginner-en-bay3D/0?curriculum_id=50a3fad8c7a770b5fd0007a1#!/exercises/0)
* [Dynamic HTML](http://www.codecademy.com/courses/web-beginner-en-v6phg/0?curriculum_id=50a3fad8c7a770b5fd0007a1#!/exercises/0)

## For concentrators

You'll be doing a bunch of little snippets which build up to one piece of code that gets checked off at the end.

### What you'll get to know

* Javascript
* Javascript's quirks
* the Document Object Model

> Warning: we're going to be giving you a lot of sample code in this lab, but we recommend *typing it in* instead of copy/pasting; it'll help you learn the syntax.

## What is Javascript?

From the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/JavaScript) (a great site for help with JS):

>JavaScript® (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, most known as the scripting language for Web pages, but used in many non-browser environments as well...

Javascript is basically the only language you can use in the browser to control the web page (e.g. make pop-ups, create an image slider, build infinite scroll). To control the web page, you use the DOM API, which is an API for the browser's inner representation of the web page.

## What is the DOM?

From the W3C (the people who design web standards):

>The Document Object Model (DOM) is an application programming interface (API) for valid HTML and well-formed XML documents. It defines the logical structure of documents and the way a document is accessed and manipulated. In the DOM specification, the term "document" is used in the broad sense.
- [W3C "What is the DOM?"](http://www.w3.org/TR/DOM-Level-2-Core/introduction.html)

The DOM represents elements (i.e. `<a>`, `<div>`, `<p>`) as nodes in a tree. These nodes are available as objects in Javascript.

## What is jQuery?
jQuery is library that wraps the DOM and creates a simpler API for interacting with it. Let's start with an example so you can get an idea of what we're talking about.

## Setup

Make a new directory (`lab2` or whatever you please), and download:

* [jquery.js](https://raw.github.com/brown-cs132-s13/labs/master/javascript/jquery.js)
* [index.html](https://raw.github.com/brown-cs132-s13/labs/master/javascript/index.html)

You can right click &rarr; "Save as..." on those links as well.

Make sure you save the files with their given names.

## Clicking A Link

### 1. Open `index.html` in your text editor. Add this in between the `<body></body>` tags:

```
<a id="mylink" href="#">this is my link</a>
```

This markup defines a link (`<a>`) element with the text "this is my link" that goes to "#" (the same page you're on now). So let's make this link do something! Add this where it says `//This is where you can add inline Javascript`:

```
//Really, type this!
var myLink = document.getElementById('mylink');

function clickMyLink (event) {
  alert("you clicked my link!");
}

myLink.onclick = clickMyLink;
```

What's going on here?

1. You ask the document for an element with the id `mylink` and save it in a variable `myLink`.
2. Your function `clickMyLink` is going to use Javacript's `alert` function to open a dialog window.
3. You tell the element that when it receives a "click" event, it should call the function `clickMyLink` and pass it an [event object](https://developer.mozilla.org/en-US/docs/DOM/event).

Now refresh the page in your browser and try clicking your link. Awesome.

Let's see how to do this with jQuery. Go back to `index.html` and replace the Javascript you just wrote with this:

```
function clickMyLink (event) {
  alert("you clicked my link!");
}

$('#mylink').on('click', clickMyLink);
```

What jQuery does here is abstract the process of selecting an element from the DOM. `mylink` can be identified in the DOM a few different ways:

(1) Element, (2) jQuery, (3) DOM

(1) `<a id='mylink'></a>`, (2) `$('#mylink')`, (3)`document.getElementById('mylink')`

(1) first `a` element, (2) `$('a')[0]`, (3) `document.getElementsByTagName('a')[0]`

(1) first child of `body`, (2) `$('body:first-child')`, (3) `document.getElementByTagName('body')[0].firstChild`

All selectors are not equal! These are listed in decreasing order of performance. jQuery is just wrapping the same DOM functions you would use on your own, and often has to do it less efficiently (because it's more generalized).

## Events

So we saw events with `onclick` and jQuery's `on()`, but *what are events*? The DOM makes a ton of use of the [delagate event model](http://en.wikipedia.org/wiki/Event_model#Delegate_event_model), meaning that when something happens in the browser, it emits events, which can be picked up (and modified) by any code that's listening. This makes it easy for programmers to add additional code to a page without worrying about other scripts (e.g. plugins, bookmarklets, frames), and allows for really decoupled design. Let's see another example:

This is another syntax for add **event listeners** to an object (besides assigning to `on[eventname]`). It's nice because you can add and remove multiple listeners for the same event:
Add this HTML between your body tags:
`<div id="display">press a key</div>`
We're going to set up event listeners for `keyup`, so you can see when the user presses a key:

```
var display = document.getElementById('display');
//Here we're going to make use of an anonymous function.
//Since functions are like any other object (number, string, etc.)
//in Javascript, we can pass a function as an argument to another function
//without issue!
document.addEventListener('keyup', function (event) {
  // the event object can tell us which key is pressed
  display.textContent = "you clicked key #" + event.keyCode;
}, false);
```
[`addEventListener` documentation](https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener)

Keyboard keys in javascript are identified by their **key codes** ([here's a ton of crazy info on it](http://unixpapa.com/js/key.html)). For example, the enter key is 13. So to only do something when the user hits "enter":

```
document.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    display.textContent = "you hit enter!";
  }
}, false);
```

Notice that we're adding the event listener to `document`. The `document` is an element like any other, referring to everything inside the `<html>` tags. We're just adding the listener there because we want to call it on a keypress *anywhere on the page*. Events bubble up the DOM tree: if you click a button, you can listen to that event on any parent element of the button (which can sometimes be tricky if you weren't expecting to get that event there).

`textContent` is a property of an element which represents its contents as text. Any tags inside it are ignored, and any tags put into it are represented literally as text. (So assigning `textContent = "<em>content</em>";` would literally show `<em>content</em>` on the page). There's a similar property which modifies the HTML directly, `innerHTML`.

Here's the same thing with jQuery:

```
var $display = $('#display'); // we prefix the variable with $ to remind ourselves it's a jQuery object
$(document).on('keyup', function (event) {
  $display.text("you just clicked: " + event.which); // which is the same as keyCode but patched up to be more consistent between different browsers
});
```

For more info on events, check out [this page on Quirksmode](http://www.quirksmode.org/js/introevents.html).

## Javascript Syntax

You've seen plenty of Javascript so far, but without a proper introduction! Javascript is a pretty crazy language, at least because it supports procedural, object-oriented, and functional programming. Here's a little cheat-sheet.

### Variables

You declare a variable in Javacript using `var`. Javascript has totally dynamic typing:

```
var lol = "laughing out loud"; // strings can be single or double quoted, nbd.
var bottlesOfBeerOnTheWall = 100;
var preciseBottlesOfBeerOnTheWall = 100.0; // all numbers in Javascript are type "number" (a float) so don't worry about it!
```

### Arrays & Objects (maps)
Arrays can be of mixed type, and are declared through a simple literal syntax that's similar to Python or Ruby:

`var myArray = [ 1, 4, 'cool', myFunction ]; // myFunction is a function`

Working with arrays:

```
myArray[0] // => 1
myArray.length // => 3
myArray.slice(0,2) // => [ 1, 4, 'cool' ]
myArray.concat(['horse']) // => [ 1, 4, 'cool', myFunction, 'horse']
```

And there's [a lot more](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array)

An **object** in Javacript is an associative array &mdash; a dictionary/hashmap/map, etc. They're easy to use, and can also have mixed types:

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

Write a similar object for yourself in the `<script>` tags in your index.html. Now open up your page in the browser in check out the Javacript console [Firefox instructions](https://developer.mozilla.org/en-US/docs/Tools/Web_Console?redirectlocale=en-US&redirectslug=Using_the_Web_Console), [Chrome instructions](https://developers.google.com/chrome-developer-tools/docs/overview). Now type the name of the variable you just made into the console. You should see the name come up with a little arrow to let you check out the object. You can see all the properties you just defined.

There are two ways to access a property on an object:

```
csStudent['name'] // 'CS Student'
```
or

```
csStudent.name // 'CS Student'
```

Note: dot notation only works with object properties that are valid identifiers (they must start with a letter and not contain spaces, hyphens, or be keywords like `for`). 

### Printing to the Console

If you open up the Javacript console (described above), you can print to it by passing a string to `console.log`. Try this in your code with the console open:  `console.log(csStudent);`

### `==` vs. `===`
One of the most common bugs in Javacript comes from using `==` rather than `===`. They're both equality operators, but with a catch: Javascript does *type coercion*, so `1 == "1"` is `true`, but `1 === "1"` is false, since `1` is a `number` and `"1"` is a `string`. It's a best practice to always use `===` so you don't get any surprises.

### Types of False
In Javascript, variables are "falsy" or "truthy", meaning that you can do `if (myNonBooleanVariable)...`. Here are the main falsy values.

#### 1. `null`
Usually used to indicate a nonexistent object, null is actually of type `object`, which leads to some confusing things like this:

```
var bigMistake = null;

if (typeof bigMistake === 'object') {
  alert("Javacript is weird!");
}
```

What happens if you put that in your `<script></script>` tags. Is that what you'd expect?

#### 2.`undefined`
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

If you're accessing a variable and you're not sure if it'll be there (because, for example, all function arguments are optional in Javascript), you should check for `undefined`:

```
var myObj = {}; // empty object

if (myObj.name === undefined) {
  console.log("no name!"); // this will always be called
}
```

#### 3.`false`
False is useful for values which are definitely known (unlike `undefined` or `null`) and definitely false.


### Surprisingly Truthy
Empty arrays and objects are always `true`. This is good to know for jQuery, where if you select something that doesn't exist, you'll still end up with a jQuery object (which is truthy). So:

```
var $nonExistent = $("#my-box.non-existent");

if ($nonExistent) {
  console.log("true!");
}
```

Just keep this in mind when you're using jQuery. When you use the DOM APIs you'll always get `null` if the DOM can't find what you're looking for.

### Functions
Functions are first-class citizens of Javacript; they're objects. You can define properties on them, and they're capable of inheritance. Here's some [advanced information about Javacript functions](http://www.quirksmode.org/js/function.html). The gist is:

#### Declaring Functions
There are two normal ways:

```
var myFunction = function (arg1, arg2, arg3, ...) { ... }; 
// or
function myFunction (arg1, arg2, arg3, ...) { ... };
```

The first is called an anonymous function, which you're assigning to a variable called `myFunction`. The second is a named function *called* `myFunction`. They are almost exactly the same, though the anonymous function doesn't know its own name. You could also instantiate a function object with `new Function()`, but there aren't many reasons to.

#### Calling Functions and `this`
Javascript has some cool ways to call functions. Of course, you can call a function by name:

```
foo()
```

or, if it's the property of an object:

```
var obj = {
  foo: function(){alert('hello, world!');}
};

//by name
obj.foo()

//dynamically: you could assign fn at runtime
var fn = "foo";
obj[fn]();
```

Functions have a special variable called `this` in their scope. When a function is called plain (e.g. `foo()`), `this` is the function itself. If the function is called as the property of another object (e.g. `obj.foo()`) `this` refers to the object before the `.` (`obj`). But in a special case where the function is called with the `new` keyword, `this` is bound to an object, and that object is returned. This is the normal way of declaring and instantiating an object type ("class") in Javascript:

```
function Person(name) {
  //assign the name property of the `this` object
  this.name = name;
}

var el_presidente = new Person('Barack');

console.log('The name of the President is ' + el_presidente.name);
```

If you want, you can call a function with a different `context`, meaning that `this` can be set to whatever object you want. You do that with [`call`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/call) and [`apply`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/apply):

```
foo.apply(otherObj, [ arg1, arg2, arg3 ]); // call foo where this === otherObj
foo.call(otherObj, arg1, arg2, arg3); 
```

The difference is how you supply arguments to the function you're calling. `apply` takes an array, call takes individual arguments.

#### Closure

Javascript functions can access variables accessable but not declared within their scope at any time.

The sterotypical version of this uses a function which returns another function:

```
function counter(){
  var count = 0;
  return function(){
    //[count] here is the [count] from above
    count++;
    return count;
  }
}

var c = counter();
c() // 1
c() // 2
c() // 3
// ...
```

This type of setup is useful especially when variables shouldn't be accessible -- there's no way for external code to change `count` (on the other hand, if it were the property of an object anything could read and write it).

Another place this becomes useful is maintaining a reference to an object in event handlers and the like:

```
//This defines a single Timer object (like a singleton class,
//only one exists and you can't instantiate it).
var Timer = {
  count: 0,
  render: function(){
    $('#count-display').text(this.count);
  },
  initialize: function(){
    //this puts a reference to [this] in this scope
    //which won't be overridden by the [this] in the scope
    //of functions defined later.
    var manager = this;

    //setInterval calls [argument1] every [argument2] milliseconds.
    setInterval(function(){
      //this reference to manager is maintained, while [this] now
      //references the function as passed to setInterval in this
      //scope.
      manager.count++;
      manager.render();
    }, 1000);
  }
};
```

#### Scoping
**The only way you can create a scope is with a function.** So `if` statements, `while` loops, etc. do not create a scope (like they do in C).

#### Inheritance
Javascript doesn't do inheritence the same way C/Java/Python/Ruby does (classically). It uses *prototypical* inheritance. It looks a little bit confusing (considering there's no `inherits` or `extends` keyword. There aren't even classes! But it's actually a really simple concept: when you call a method on an object, Javacript goes up that object's prototype chain (its parents' prototypes) looking for a method with that name. While that sounds a lot like classical inheritence, it's actually a lot simpler, since it doesn't require any classes or interfaces. 

You don't really need multiple inheritence since you can inherit from any list of prototypes in any order you want; they don't have to implement the same methods! Try this out:

Put this in your `<script>` tag:

```
// this is the constructor for a Friend object
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
var oldMan = new Friend(90, "m", "Providence");
$display.html(oldMan.info());
```

But what if we want to create an object that inherits from `Friend`, say, a `CyberFriend`? Since we're working with Functions, calling the super-object is as easy as calling a function with the context (`this`) set to our new object:

```
function CyberFriend (age, sex, location, screenname) {
  Friend.call(this, arge, sex, location); // call the parent (like super() in Java)
  this.screenname = screenname;
}
```

Now we want to set CyberFriend's prototype to an instance of Friend's `prototype`. We don't want to use Friend's `prototype` directly because then we'd be messing with `Friend`. So we create a dummy function with a blank constructor so we can instantiate a new `Friend` prototype:

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

This can get pretty confusing and might be worth reading twice. Evan Wallace also has a section on the same topic in [Javascript for Coders](http://madebyevan.com/jsintro/#Classes_Prototypes).

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
      ableTo.push('drink', 'gamble');
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
Similar deal here. It looks just like C:

```
for (var i=0; i < someArray.length; i++){
  console.log(someArray[i]);
}
```

The only difference is how you can iterate over an object:

```
for (var key in object) {
  console.log("key: " + key + " value: " + object[key]);
}
```

Note that this syntax gives you all the keys defined on the object *including keys of its prototypes*. That can lead to some unpleasant surprises, so it's best practice to use `hasOwnProperty`, which returns `true` if and only if the property name is defined for that object directly:

```
for (var key in object) {
  if (!object.hasOwnProperty(key)){continue;}
  console.log("key: " + key + " value: " + object[key]);
}
```

You can use that syntax with arrays too, but it's pretty pointless, since `key` would just be the index in the array, and this type of loop is slower. Javascript also has `while` loops just like C/Java, and you can use `++/--` unary operators on values. Javascript also has a `break` keyword for getting out of a loop and a `continue` statement for going to the next iteration.

## Cool Demo
Let's use some of your Javacript knowledge. Change your index HTML to have this in the `<body>`:

```
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
```

We're going to make a widget where you can save ages by name. We want the user to input a name; if we find it, we'll show the age. Otherwise, we'll show an input for the user to give us the age. Notice that both the `result` and `input` div's are set to `display:none;`. (So they're hidden.)

First, we need to wrap our code as a callback from jQuery's `ready()` event; this ensures that when we select elements on the page they exist (the browser might run some Javascript before its rendered the whole page). Then we want to save references to the name input, the age input, and the result box.

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
        //You need to:
          //Store the name with whatever is in the age input in data
          //Show that data for the name
      });
    }
  });
```

Great! When you've gotten this working, ask your TA to check you off.

## Javascript Resources

### Reference
* [Mozilla Developer Network: Javascript](https://developer.mozilla.org/en-US/docs/JavaScript)
* [Quirksmode Javascript](http://www.quirksmode.org/js/contents.html)
* [jQuery documentation](http://api.jquery.com/)
* [jQuery source browser](http://www.james.padolsey.com/jquery/)
* [Javascript Garden (Javascript quirks)](http://bonsaiden.github.com/JavaScript-Garden/)
* [jsFiddle](http://jsfiddle.net/) - in-browser javascript "sandbox"

### Other introductions
* [John Resig: Learn Advanced Javascript](http://ejohn.org/apps/learn/)
* [Intro to Javascript For Coders](http://madebyevan.com/jsintro/)
