var fs = require('fs'),
    path = require('path');

fs.readFile(__filename, function(err, data){
    console.log('The contents of', path.basename(__filename), 'is:\n');
    console.log(data.toString('utf8'));
});
