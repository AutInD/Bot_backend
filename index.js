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

  function WriteOrder(agent){
	let date = new DateTime();
	const data = {
	  Order_CountProduct: 6,
	  Order_TotalCost: 1350,
	  Order_Date: date,
	  Order_Status: "No",
	  Order_CusName: "อรรถพล ตันติวัฒนะผล",
	  Order_CusTel: "0827754150",
	  Order_CusAdd: "ง.78/113 ถ.ดาวดึงส์ ต.ปากน้ำโพ อ.เมือง จ.นครสวรรค์ 60000",
	  Order_DeliveryType: "ปลายทาง",
	  Order_Tracking: "No",
	};
	return connectToDatabase()
	.then(connection => {
	  return insertIntoDatabase(connection, data)
	  .then(result => {
	 agent.add(`Data inserted`);       
		connection.end();
	  });
	});
  }

  function WriteOrder(agent){
	let date = new Date();
	const data = {
	  Order_CountProduct: 6,
	  Order_TotalCost: 1350,
	  Order_Date: date,
	  Order_Status: "No",
	  Order_CusName: "อรรถพล ตันติวัฒนะผล",
	  Order_CusTel: "0827754150",
	  Order_CusAdd: "ง.78/113 ถ.ดาวดึงส์ ต.ปากน้ำโพ อ.เมือง จ.นครสวรรค์ 60000",
	  Order_DeliveryType: "ปลายทาง",
	  Order_Tracking: "No"
	};
	return connectToDatabase()
	.then(connection => {
	  return insertIntoDatabase(connection, data)
	  .then(result => {
	 agent.add(`Data inserted`);       
		connection.end();
	  });
	});
  }