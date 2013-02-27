SQL
====

Structured Query Language is a language to speak to databases.

A database is a collection of tables. Each table has a number of columns (or fields)
and rows. Rows usually represent a thing, and columns are one aspect of that thing.
For example, we might have a table `people` with columns for first name, last name,
and age. Columns usually have types like `text` or `integer` to indicate what sort
of data they are.

Databases are complicated and you won't have to implement one -- but you will have
to leverage one. There are many SQL databases such as MySQL, PostgreSQL, and what
you'll be using today: SQLite3. SQLite is a little bit different from most other
databases because the database is simply stored in a file. (Yours will be named
zipcodes.db and should appear in the same directory as everything else when you run
your loader.) The library you'll be using to talk to the database, AnyDB, abstracts
many of these differences.

Once you're able to talk to a database you can manipulate its contents through
saying SQL statements, which the server will respond to. The process of sending
a statement and recieving an answer is called querying, and you'll often hear
SQL statements referred to as "queries." *We'll get into the specifics of sending
and receiving later.*

The three types of statements you'll need to know for this lab (as well as project 3)
are `CREATE TABLE`, `INSERT INTO`, and `SELECT`. (Most databases don't care about
the case, but SQL commands are conventionally typed in upper-case.)

`CREATE TABLE` does exactly what it sounds like. It creates a new table in the database
given a specification of the columns the table should contain. A newly created table
has 0 rows. A `CREATE TABLE` statement for the `people` database might look like this:

```
CREATE TABLE people (firstname TEXT, lastname TEXT, age INTEGER);
```

The database doesn't say much in response to a `CREATE TABLE` unless there's an error,
so you can ignore it for now. _Note_: asking the database to `CREATE TABLE` with that name exists already is an error! The most straightforward way to deal with
this is to delete the database (which isn't destructive because you're filling it back
up again every time when you run your loader.)

`INSERT INTO` is also pretty straightforward: it inserts (adds) a row into a table. You'll give
it the name of the table as well as the values for each column and it creates a new row.
We could add a new person to `people` like this:

```
INSERT INTO people VALUES ('Sam', 'Birch', 20)
```

Again, the server doesn't say much in response to an `INSERT INTO`.

`SELECT` is a little trickier, but a good metaphor might be "find me rows." It takes
three components: a what (a comma seperated list of columns, or `*` for all of them), a table, and a corollary
clause called `WHERE`. It's clearer when it's written out:

```
SELECT lastname, firstname FROM people WHERE age=20
```

The database would return the last and first names of all the people in the table who have
an age of 20. We could fetch the whole row instead:

```
SELECT * FROM people WHERE age=20
```

Unlike `CREATE TABLE` and `INSERT INTO`, the database's response to a `SELECT` is important!
Again, we'll get into the specifics of reading responses later, but for now understand
that the database will be sending you a list of rows which fulfil your `WHERE` clause.

One final note: finding rows which fulfill a WHERE clause is a tricky operation because
databases don't like to check every row one-by-one (called a table scan) -- it's quite slow.
Even on the relatively small scales you'll be using for this class it's important to speed it
up. The way databases do this is called indexing. Luckily the only thing you have to do
to make this work is tell the database to do it. You should choose one column which will
always have a distinct value and which you will be using frequently as a predicate in your
`WHERE` clause. For the people database we don't really have a good example (since people
can have the same name) -- we might use Social Security number, phone number, or email
instead. The syntax is as follows:

```
CREATE TABLE people (phone TEXT PRIMARY KEY, firstname TEXT, lastname TEXT, age INTEGER);
```

# Your task

In this lab you will be implementing the Zipcoder, a website which tells you where
a zipcode is. Zipcodes for the unfamiliar are 5 digit numbers which specify a region
in the United States (a town, a part of a city, etc.). For example:

02912: Brown University (Providence, RI)

10001: [A sliver of Manhattan](http://goo.gl/maps/7H8Nh)

20500: The White House

02906: Region around Brown in Providence

## Setup

Download the stencil folder for this lab [here](http://cs.brown.edu/courses/cs132/labs/SQL-lab.zip) and extract
it. Open a terminal and `cd` into that directory.

Run `npm install` at the command line to install required libraries for this lab.

This shouldn't raise any errors but flag a TA if it does!

## The loader

Open up 'loader.js' and you will notice we've required two modules at the top,
'anyDB' and 'zipcoder.js'. Zipcoder is a local module that we've written for you
to read in a comma seperated list of zipcodes (.csv files), more on that later. 

[AnyDB](https://github.com/grncdr/node-any-db) is a package on npm that provides
a simplified interface between your node.js app and a database. One nice thing
about anyDB is that it makes it easy to swap one type of database for another.
In this lab we'll be using SQLite3, but in your next project you'll be using
PostgreSQL. AnyDB provides a common way to interact with databases, regardless of
which specific one we choose. The first step is to create a connection to our
database.

    var conn = anyDB.createConnection('sqlite3://zipcodes.db');

This creates a variable `conn` which now acts as our access point into the
database file. For instance if we want to run a bit of SQL on our database we
use `conn.query('INSERT SQL HERE')`.

AnyDB actually lets us run queries in two different ways. Perhaps the most
straightforward method is to provide the query with a callback function to be called once the SQL has run on our db. This style is hopefully becoming a familiar pattern by now. 

`conn.query('SQL STATEMENT', function(error, result) {...});`

Alternatively we can attach callbacks to specific events on the query. This is
quite a useful feature of AnyDB since we can, for instance with a `SELECT` query, process rows as they
are read from the database, instead of all at once. We've seen this pattern
before too.

`conn.query('SQL STATEMENT').on('row', function(row) {...});`

Specifically, anyDB supports `row`, `end` and `error` events. The `end` event is
fired when, as you might have guessed, the query has completed.  

Hopefully now the stencil code makes sense. It's your job to fill in the SQL to
create the table that will store the zip codes. Make sure you create a column
for each field you will be storing. What type should each field be?

    conn.query('SOME SQL STATEMENT TO DEFINE YOUR TABLE') 
        .on('end', function() {
          console.log('Made table!');
        });

Once you have created a table, you'll need to populate it with data from one of
the .csv files. We've provided you with the zipcoder module to help you do this.
As you'll find in the stencil code, zipcoder takes a .csv file of regions and
calls a callback function on each region. The stencil code prints out the
region, which might be useful for testing, but you will want to insert each
region into your table here.

    zipcoder('some_zipcodes.csv', function(region) {
      console.log(region);
      // insert region into table
      conn.query('SQL STATEMENT TO INSERT A ROW', [param1, param2, ...])
        .on('error', console.error);
    });

> Hint: the parameters should line up with the each column in the row you are
inserting.

## The server

The second portion of your task for this project is to write a server using Node and
Express to allow users to look up the locations of Zipcodes. You can implement this
any way that works, but one simple (and uninteresting!) way might be to display the
location of a Zipcode in the URL:

```
localhost:8080/02912

-> PROVIDENCE, RI
```

You can parametrize the path with Express simply:

```
app.get('/:zipcode', function(request, response){
	//request.params.zipcode contains the Zipcode from the path!
	//Use that to write a query for your database and return the result.
});
```
