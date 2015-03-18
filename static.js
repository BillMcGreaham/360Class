var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (req, res) {
	var urlObj = url.parse(req.url, true, false);
	var myRe = new RegExp("^"+urlObj.query["q"]);
	var jsonResult = [];

	if(urlObj.pathname.indexOf("comment") !=-1) {
		console.log("comment route");
    		if(req.method === "POST") {
      			console.log("POST comment route");
// First read the form data
       			var jsonData = "";
             		req.on('data', function (chunk) {
                     		jsonData += chunk;
                           });
                        req.on('end', function () {
                        	var reqObj = JSON.parse(jsonData);
                                console.log(reqObj);
                                console.log("Name: "+reqObj.Name);
                                console.log("Comment: "+reqObj.Comment);

        			// Now put it into the database
	       			var MongoClient = require('mongodb').MongoClient;
        			MongoClient.connect("mongodb://localhost/weather", function(err, db) {
          				if(err) throw err;
          				db.collection('comments').insert(reqObj,function(err, records) {
           	 				console.log("Record added as "+records[0]._id);
          				});
        			});
				res.writeHead(200);
				res.end();
			});
    		}
		else if(req.method === "GET") {
      			console.log("In GET"); 
			var itemDone;
			var MongoClient = require('mongodb').MongoClient;
	      		MongoClient.connect("mongodb://localhost/weather", function(err, db) {
	        		if(err) throw err;
	        		db.collection("comments", function(err, comments){
	          			if(err) throw err;
	          			comments.find(function(err, items){
	            				items.toArray(function(err, itemArr){
	        					if(err) console.log("error");
		      					console.log("Document Array: ");
	              					console.log(itemArr);
							//itemDone = JSON.parse(JSON.stringify(itemArr)); 
							res.writeHead(200);
							res.end(JSON.stringify(itemArr));
							console.log("0");
						});
					console.log("1");
	          			});
				console.log("2");
	        		});
	 	console.log("3");
		});
	console.log("4");
    		}//end else if
  /*	
		else{
			fs.readFile(ROOT_DIR + urlObj.pathname, function(err,data){
				if(err){
					res.writeHead(404);
					res.end(JSON.stringify(err));
					return;
				}
				res.writeHead(200);
				res.end(data);
			});
		} //end else	
*/

	 //end pathname.indexOf("comment");
	}
	else if(urlObj.pathname.indexOf("getcity")!= -1){
		console.log("In REST service");

		fs.readFile('cities.txt', function(err, data){
			if(err) throw err;
			cities = data.toString().split("\n");
			for(var i = 0; i < cities.length; i++){
				var result = cities[i].search(myRe);
				if(result != -1){
					console.log(cities[i]);
					jsonResult.push({city:cities[i]});
				}//if
			}//for
			console.log(JSON.stringify(jsonResult));
			res.writeHead(200);
			res.end(JSON.stringify(jsonResult));
		});	//fs.readFile cities.dat.txt
	} else{

	fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
		if (err) {
      		res.writeHead(404);
      		res.end(JSON.stringify(err));
      		return;
    	} 		//fs.readFile ROOT_DIR
    	res.writeHead(200);
    	res.end(data);
  	}); 		//if urlObj.pathname
	} //else
}).listen(80); 	//http.createServer


