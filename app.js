const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const port = 3000;
const mysql = require('mysql2');
const {Image} = require('dialogflow-fulfillment');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');

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

    function connectToDatabase(){
      const connection = mysql.createConnection({
      host     : '188.166.223.10',
      user     : 'authapol',
      password : '4150Tainner!',
      database : 'ChatBotForSMEsDB'
      });
      return new Promise((resolve,reject) => {
        connection.connect();
        resolve(connection);
     });
    }
    function queryDatabase(connection){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Product', (error, results, fields) => {
          resolve(results);
        });
      });
    }

    async function demo(agent){
        const connection = await connectToDatabase();
      const result_1 = await queryDatabase(connection);
      const see = {
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
               {
                "title":"Welcome!",
                "image_url":"https://petersfancybrownhats.com/company_image.png",
                "subtitle":"We have the right hat for everyone.",
                "default_action": {
                  "type": "web_url",
                  "url": "https://petersfancybrownhats.com/view?item=103",
                  "messenger_extensions": false,
                  "webview_height_ratio": "tall",
                  "fallback_url": "https://petersfancybrownhats.com/"
                },
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://petersfancybrownhats.com",
                    "title":"View Website"
                  },{
                    "type":"postback",
                    "title":"Start Chatting",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD"
                  }              
                ]      
              }
            ]
          }
        }
      }
    }
    agent.add(new dfff.Payload(agent.UNSPECIFIED, see, {sendAsMessage: true, rawPayload: true}))
    connection.end();
    }

    async function product(agent){ 
      const user_email = agent.parameters.Product;
    return connectToDatabase()
    .then(connection => {
      return queryDatabase(connection)
      .then(result => {
        //console.log(result);
        result.map(user => {
          if(user_email === user.Product){
            /*agent.add(`ชื่อสินค้า: ${user.Product_Name}`);
            agent.add(`จำนวน: ${user.Product_Count}`);
            agent.add(`วันหมดอายุ: ${user.Product_Expire}`);
            agent.add(`ราคา: ${user.Product_Cost}`);
            agent.add(`ราคา: ${user.Product_Detail}`);*/
            
            const card = new Card(`${user.Product_Name} ราคา: ${user.Product_Cost}`);
            card.setImage(`${user.Product_Name}`);
            card.setText(`${user.Product_Detail}`);
            card.setButton({text: `สั่งเลย`, url:`${user.Product_Name}`});
            agent.add(card);
          }
        });        
        connection.end();
      });
    });
    }

    var intentMap = new Map();
    intentMap.set('เรียกดูสินค้า',demo)
    intentMap.set('product', product)
    agent.handleRequest(intentMap);
});
