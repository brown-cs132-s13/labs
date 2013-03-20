var anyDB = require('any-db');
var zipcoder = require('./zipcoder.js');

var conn = anyDB.createConnection('sqlite3://zipcodes.db');

// Your implementation here!

/*

1. Create a table in zipcodes.db (NOTE: if it's already been created this will
   probably cause an error! You should delete it first.)


conn.query('SOME SQL STATEMENT TO DEFINE YOUR TABLE')
	.on('end', function(){
		console.log('Made table!');
	});


2. When that's done, load zipcodes from a file.
zipcodes.csv is the full zipcodes database and will take awhile to load into a database
some_zipcodes.csv is a sample of the zipcodes and is probably better for testing.
Brown's zipcode (02912) is defined in both.

You can use the zipcoder (included above) to load a zipcodes file. It takes the
name of a file and a callback which gets one argument, a region object. Region
objects have a bunch of fields, probably most relevant are region.zipcode,
region.city, and region.state. You can see other fields by trying out the
example below.

This will print all the zipcodes defined in the sample (~400):
zipcoder('some_zipcodes.csv', function(region){
		console.log(region);
	});

3. For each one of those regions, run another query to insert a row into the table
you defined. You can use parameterized statements to make this easier and safer.
The strings $1 and $2, for example, will be replaced by the values of the first
and second elements of the list you pass afterwards.

conn.query('SOME SQL STATEMENT TO INSERT A ROW', [param1, param2, ...])
	.on('error', console.error);

*/

