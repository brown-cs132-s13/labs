var fs = require('fs');
var csv = require('csv');
//For zipcodes.csv, from http://federalgovernmentzipcodes.us/

var fields = {
	0: 'zipcode',
	1: 'type',
	2: 'city',
	3: 'state',
	4: 'locationType',
	5: 'lat',
	6: 'long',
	7: 'location',
	8: 'decommisioned',
	9: 'numTaxReturns',
	10: 'estimatedPopulation',
	11: 'totalWages'
};
var transformers = {
	'lat': parseFloat,
	'long': parseFloat,
	'numTaxReturns': parseFloat,
	'estimatedPopulation': parseFloat,
	'totalWages': parseFloat,
	'decommisioned': function(x){return x === 'true';}
};
function transform(row){
	var r = {};
	for(var i=0;i<row.length;i++){
		r[fields[i]] = transformers.hasOwnProperty(fields[i])?
			transformers[fields[i]](row[i]):row[i];
	};
	return r;
}

function main(file, callback){
	csv().from.stream(fs.createReadStream(file))
		.on('record', function(row, index){
			var row = transform(row);
			callback(row);
		});
}


module.exports = main;