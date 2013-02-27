SQL
====

Structured Query Language is a language to speak to databases.

A database is a collection of tables. Each table has a number of columns (or fields)
and rows. Rows usually represent a thing, and columns are one aspect of that thing.
For example, we might have a table of "people" with columns for first name, last name,
and age.

More here about basic statements: create table, insert, select

More about indexes and why you should have a key

# Your task

In this lab you will be implementing the Zipcoder, a website which tells you where
a zipcode is. Zipcodes for the unfamiliar are 5 digit numbers which specify a region
in the United States (a town, a part of a city, etc.). For example:

02912: Brown University (Providence, RI)

10001: [A sliver of Manhattan](http://goo.gl/maps/7H8Nh)

20500: The White House

02906: Region around Brown in Providence

## Setup

Run 'npm install' at the command line to install required libraries for this lab.

Download from github...

## The loader

Open up 'loader.js' and you will notice we've required two modules at the top,
'anyDB' and 'zipcoder.js'. Zipcoder is a local module that we've written for you
to read in a comma seperated list of zipcodes (.csv files), more on that later. 

[AnyDB](https://github.com/grncdr/node-any-db) is a package on npm that provides
a simplified interface between your node.js app and a database. One nice thing
about anyDB is that it makes it easy to swap one type of database for another.
In this lab we'll be using sqlite3, but in your next project you'll be using
progresql. AnyDB provides a common way to interact with databases, regardless of
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
quite a useful feature of anyDB since we can, for instance with a SELECT query, process rows as they
are read from the database, instead of all at once. We've seen this pattern
before too.

`conn.query('SQL STATEMENT').on('row', ...);`

Specifically, anyDB supports 'row', 'end' and 'error' events. The 'end' event is
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
As you'll find in the stencil code, zipcoder takes a .csv file of regions and calls a callback function on each region. The stencil code prints out the region, which might be useful for testing, but you will want to insert each region into your table here.

    zipcoder('some\_zipcodes.csv', function(region) {
      console.log(region);
      // insert region into table
      conn.query('SQL STATEMENT TO INSERT A ROW', [param1, param2, ...])
        .on('error', console.error);
    });

> Hint: the parameters should line up with the each column in the row you are
inserting.

## The server
