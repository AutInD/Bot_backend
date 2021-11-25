const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const port = 3000;
const mysql = require('mysql2');
var temp_prod;
const connection = mysql.createConnection({
	host     : '188.166.223.10',
	user     : 'authapol',
	password : '4150Tainner!',
	database : 'ChatBotForSMEsDB'
  });
  app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})

app.get('/', (req, res)=>{
    res.send("Working")
});

app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });

    function demo(agent){
        agent.add('ASDASDASD');
    }
    function product(agent){
        var payloadData = {            
            "richContent": [
                [
                  {
                    "type": "accordion",
                    "title": "Accordion title",
                    "subtitle": "Accordion subtitle",
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": "Accordion text"
                  }
                ]
              ]          
        }
        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
    }

    var intentMap = new Map();
    intentMap.set('เรียกดูสินค้า',demo)
    intentMap.set('product', product)
    agent.handleRequest(intentMap);
});
