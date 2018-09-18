var server  = require('express')();
var fs = require('fs');
var bodyParser =  require('body-parser');
var formidable = require('formidable');
server.set('view engine','ejs');

server.use(bodyParser());

//ASSIGNMENT 1

//server to listen on port 3001
server.listen(3001, function(){
	console.log('Server running on port 3001!!!');
})

//business logic to load the file from any directory assigned from commandline
let filepath = '';
let i=2;
while(typeof process.argv[i] !== 'undefined')
	filepath = filepath+process.argv[i++];	

//assign default filepath
if(filepath === '')
	filepath = 'demo.txt';

//fileread login
	fs.readFile(filepath,'utf8', function(error,dataRecevied){
		//if there is any error in filepath
		if(error){
			console.log('OOPS!!! There was some error in filepath or fileread. Try again!.');
		}
		else{
			console.log(dataRecevied);
		}
	
});


//ASSIGNMENT 2

//Rest API call to find product of two numbers
server.get('/numberproduct',function(req,res){
	//Find the object keys of the numbers provided in query parameters
	var numKeys = Object.getOwnPropertyNames(req.query);
	if(numKeys.length === 2  ){
		//Find the product
		var a = Number(req.query[numKeys[0]]);
		var b = Number(req.query[numKeys[1]]);
		console.log(a);
		console.log(typeof b);
		if(a == NaN || b == NaN){
			res.write('The entered query parameters are not numbers');
			res.end();
		}else{
			var product=a*b;
			res.write('The product of the number a and b provided in Query Parameters is = '+product);
			res.end();
		}		
	}else{
		// if the Query params are not provided or more than two numbers are provied in request query parameters
		res.write('kindly provide 2 query parameters to get the desired output');
		res.end();
	}
});


//ASSIGNMENT 3

//REST API to load the page to accept the string to find the non-repeating character
server.get('/findnonrepeatingchar', function(req,res){
	res.render('index',{character:"" });
})

//REST API Accept the String and logic to find the non-repeating character
server.post('/findnonrepeatingchar', function(req,res){
	let text = req.body.demoTextName;
	let arrString = text.split('');
	let flag = 0;
	for(let k=0;k < arrString.length; k++){
		let indexOfFirst = text.indexOf(arrString[k]);
		let indexOfSecond = text.indexOf(arrString[k],indexOfFirst+1);
		console.log(indexOfSecond);
		if(indexOfSecond === -1){
			flag=1;
			console.log(req.body);
			res.render('index',{character:"The Ist non-repeating character is "+arrString[k]});
			res.end();
			break;
		}
	}
	if(flag === 0){
		res.render('index',{character:"There is no non-repeating charater in the entered String"});
		res.end();
	}
})


//ASSIGNMENT 4

//REST API call to browse the file to upload to Disk
server.get('/fileUpload', function(req, res){
	res.render('fileUpload',{character:''});
});

//REST API call to upload file to the disk logic
server.post('/fileUpload', function(req, res){
	 let form = new formidable.IncomingForm();
	 form.parse(req, function(err, fields, files){
		let oldpath = files.filename.path;
		let newpath = __dirname + '\\'+ files.filename.name;
		fs.rename(oldpath, newpath, function (err) {
			if (err){
				//if there is some error in uploading the file
				res.render('fileUpload',{character:'File Upload not successful!!!..Please try again'});
			}
			else{
				res.render('fileUpload',{character:'File uploaded and moved!'});
				res.end();
			}
		});
	})
})