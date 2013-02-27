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

Download the stencil folder for this lab [here](UPLOADTOSERVER) and extract
it. Open a terminal and `cd` into that directory.

Run `npm install` at the command line to install required libraries for this lab.

This shouldn't raise any errors but flag a TA if it does!

## The loader

## The server

The second portion of your task for this project is to write a server using Node and
Express to allow users to look up the locations of Zipcodes. You can implement this
any way that works, but one simple (and uninteresting!) way might be to display the
location of a Zipcode in the URL:

```
localhost:8080/02912

-> PROVIDENCE, RI
```

