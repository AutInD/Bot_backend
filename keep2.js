const express = require('express')
const dialogflow = require('@google-cloud/dialogflow');
const config = require('C:/Work/GreenPlus/newagent-af9v-8f04ca7d93ba.json');
const http = require('http');
require('dotenv').config()
const uuid = require('uuid');
const mysql = require('mysql2');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');   
const { IntentsClient } = require('@google-cloud/dialogflow/build/src/v2');
const app = express()  
const port = process.env.PORT || 3000


var temp_prod = '';	
	  app.use(express.json())
	  app.use(express.urlencoded({ extended: true }))
	  
	  
	  
	  app.listen(port, () => {
		  console.log(`🌏 Server is running at http://localhost:${port}`)
	  })




const connection = mysql.createConnection({
	host     : '188.166.223.10',
	user     : 'authapol',
	password : '4150Tainner!',
	database : 'ChatBotForSMEsDB'
  });
  const projectId = config.project_id
	// A unique identifier for the given session
	const sessionId = uuid.v4();
	const sessionClient = new dialogflow.SessionsClient({
        keyFilename:"C:/Work/GreenPlus/newagent-af9v-8f04ca7d93ba.json"
    });
	const sessionPath = sessionClient.projectAgentSessionPath(
	  projectId,
	  sessionId
	);
    /*connection.query(
		'SELECT * FROM `Product`',
		function(err, results, fields) {
			temp_prod = results; // results contains rows returned by server
			console.log(temp_prod);
			//res.status(200).json({"data":temp_prod})
		}
	  );*/
app.post('/chatbot', async (req, res) => {
	console.log(req.body);
	/*connection.query(
		'SELECT * FROM `Product`',
		function(err, results, fields) {
			temp_prod = results; // results contains rows returned by server
			console.log(temp_prod);
			res.status(200).json({"data":temp_prod})
		}
	  );
	const request = {
		session: sessionPath,
		queryInput: {
		  text: {
			// The query to send to the dialogflow agent
			text: 'มีสินค้าอะไรบ้าง',
			// The language used by the client (en-US)
			languageCode: 'en-US',
		  },
		},
	  };*/
	  /*const responses = await sessionClient.detectIntent(req.body);
	  console.log('Detected intent');
	  const result = responses[0].queryResult;
	  console.log(`  Query: ${result.queryText}`);
	  console.log(`  Response: ${result.fulfillmentText}`);
	  if (result.intent) {
		console.log(`  Intent: ${result.intent.displayName}`);
	  } else {
		console.log('  No intent matched.');
	  }*/

	  res.json({
		  	
		
			"fulfillmentMessages": [
			  {
				"text": {
				  "text": [
					"Text response from webhook"
				  ]
				}
			  }
			]		  
	  })
	  // Send request and log result
	  
      
	/*connection.query(
		'SELECT * FROM `Product`',
		function(err, results, fields) {
			temp_prod = results; // results contains rows returned by server
			console.log(temp_prod);
			res.status(200).json({"data":temp_prod})
			
			//console.log(fields); // fields contains extra meta data about results, if available
		}
	  );	*/
})


async function runSample(projectId = 'jamemo-pp9o') {
	// A unique identifier for the given session
	const sessionId = uuid.v4();
	
	// Create a new session
	const sessionClient = new dialogflow.SessionsClient();
	const sessionPath = sessionClient.projectAgentSessionPath(
	  projectId,
	  sessionId
	);
	const request = {
		session: sessionPath,
		queryInput: {
		  text: {
			// The query to send to the dialogflow agent
			text: 'มีสินค้าอะไรบ้าง',
			// The language used by the client (en-US)
			languageCode: 'en-US',
		  },
		},
	  };
	
	  // Send request and log result
	  const responses = await sessionClient.detectIntent(request);
	  console.log('Detected intent');
	  const result = responses[0].queryResult;
	  console.log(`  Query: ${result.queryText}`);
	  console.log(`  Response: ${result.fulfillmentText}`);
	  if (result.intent) {
		console.log(`  Intent: ${result.intent.displayName}`);
	  } else {
		console.log('  No intent matched.');
	  }
	}	




