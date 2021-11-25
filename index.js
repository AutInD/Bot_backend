const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mysql = require('mysql2');


const connection = mysql.createConnection({
	host     : '188.166.223.10',
	user     : 'authapol',
	password : '4150Tainner!',
	database : 'ChatBotForSMEsDB'
  });
  app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})


app.get('/', async(req, res) => {
	connection.query(
		'SELECT * FROM `Product`',
		function(err, results, fields) {
			temp_prod = results; // results contains rows returned by server
			console.log(temp_prod);
			res.status(200).json({"data":temp_prod})
			
			//console.log(fields); // fields contains extra meta data about results, if available
		}
		
	  );
	  return temp_prod;
  })