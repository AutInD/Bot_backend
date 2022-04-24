const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const dfff = require('dialogflow-fulfillment');
const port = 5000;
const mysql = require('mysql');
const {Image} = require('dialogflow-fulfillment');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card} = require('dialogflow-fulfillment');
const {Suggestion} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');
const { DateTime } = require('actions-on-google');
const moment = require('moment');
const Keep = require("./config");
const getFacebookIds = require('get-facebook-id');
const VERIFY_TOKEN = 'Jamemo';
timedate = new Date();
prodName = [];
countProduct = 0;
deliveryType = '';
statusDel = '';
cusName = '';
cusAdd = '';
cusTel = '';
currentDate = '';
tracking = 'ยังไม่มีพัสดุ';
addressTemp = '';
phoneNumberTemp = '';
givenNameTemp = '';
lastNameTemp = '';
senderId = '';
idProduct = '';
orderPayment = '';
count = 0;
count2 = 0;
temp = '';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

  app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
});
app.get('/', function (_req, res) {
  res.send('Hello World');
});

app.post('/chatbot', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({request : req,response : res});
    JSON.stringify(req.headers);
    JSON.stringify(req.body);
      let action = req.body.queryResult.action; 
      let responseJson = {};
    //responseJson.fulfillmentText = 'This is an endpoint published to RunKit'; // displayed response 



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
        connection.query('SELECT * FROM Product' , (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function queryOrderDatabase(connection){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ChatBotForSMEsDB.Order' , (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function queryOrderDtDatabase(connection){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ChatBotForSMEsDB.Order_detail' , (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function insertIntoDatabase(connection, data){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO ChatBotForSMEsDB.Order SET ?',  data, (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function insertIntoDatabase2(connection, data){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO ChatBotForSMEsDB.Order_detail SET ?',  data, (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function cutStock(connection, data){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE Product SET ? WHERE idProduct = ?`, [data, data.idProduct], (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function updateOrTotal(connection, data){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE ChatBotForSMEsDB.Order SET ? WHERE id = ?`, [data, data.id], (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function updateOdTotal(connection, data){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE Order_detail SET ? WHERE idOrder_detail = ?`, [data, data.idOrder_detail], (error, results, fields) => {
          resolve(results);
        });
      });
    }

    function updateProductCount(id,newQty){
      const data = {
        idProduct: id,
        Product_Count: newQty,
      };



      
      console.log(data)
      return connectToDatabase()
      .then(connection => {
        return updateDatabase(connection, data)
        .then(result => {
          connection.end();
        });
      });
    }
  
    async function product(agent){
    return connectToDatabase()
    .then(connection => {
      return queryDatabase(connection)
      .then(result => {
        //console.log(result);
        result.map(user => {          
            const card = new Card(`${user.Product_Name} ราคา: ${user.Product_Cost}`);
            card.setImage(`https://fad2-2403-6200-88a3-b35b-7c53-4dd0-2492-7c51.ngrok.io/${user.Product_Picture}`);
            card.setText(`${user.Product_Detail}`);
            card.setButton({text: `สั่ง`+user.Product_Name, url:`${user.Product_Name}`});
            agent.add(card);           
        }); 
        agent.add("สินค้าของทางร้านขายสมุนไพรชงดื่มเลือกซื้อได้เลยค่ะ")
        connection.end();
      });
    });
    }

    async function properties(agent){
      const {
        producttype
      } = agent.parameters;
      return connectToDatabase()
      .then(connection => {
        return queryDatabase(connection)
        .then(result => {
          for(let n = 0; n < result.length;n++){
            if(producttype == `${result[n].Product_Name}`){
              const card = new Card(`${result[n].Product_Name} ราคา: ${result[n].Product_Cost}`);
              card.setImage(`https://fad2-2403-6200-88a3-b35b-7c53-4dd0-2492-7c51.ngrok.io/${result[n].Product_Picture}`);
              card.setText(`${result[n].Product_Detail}`);
              card.setButton({text: `สั่ง`+result[n].Product_Name, url:`${result[n].Product_Name}`});
              agent.add(card);
              }
            else if(producttype == 'เห็ดหลินจือ'){
              const card2 = new Card(`${result[0].Product_Name} ราคา: ${result[0].Product_Cost}`);
              card2.setImage(`https://fad2-2403-6200-88a3-b35b-7c53-4dd0-2492-7c51.ngrok.io/${result[0].Product_Picture}`);
              card2.setText(`${result[0].Product_Detail}`);
              card2.setButton({text: `สั่งเห็ดหลินจือ`, url:`สั่งเห็ดหลินจือ`});
              agent.add(card2);
              agent.add('เห็ดหลินจือมีสองสูตร สูตรดั้งเดิมและสูตรเข้มข้น\nสูตรเข้มข้นจะขมพอทานได้และสูตรดั้งเดิมจะขมปานกลางค่ะ')
            }
          }
          connection.end();
          
        });
      });
    }

    async function demo(agent){ 
      const user_email = agent.parameters.Product;
    return connectToDatabase()
    .then(connection => {
      return queryDatabase(connection)
      .then(result => {
        //console.log(result);
        result.map(user => {
          const payload = {
            key: 'value',
            key2: 2
          };
          
          agent.add(
            new WebhookClient(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
          );
        });        
        connection.end();
      });
    });
    }

    function Order(agent){      
      const {
        producttype1, number1, Flavormushroom    
      } = agent.parameters;
      /*const connection = await connectToDatabase();
      const result_Order = insertIntoDatabase(connection, data);*/
      
      
      return connectToDatabase()
      .then(connection => {
      let check, plus ;
      let plus2 = false;
      let pdName = [];
      countProduct = number1; 

        for (let n = 0; n < producttype1.length ; n++){
          check = producttype1[n] == 'เห็ดหลินจือ';
          if(check == true)break;
        }
  

        data = {
          Order_SenderID : req.body.originalDetectIntentRequest.payload.data.sender.id
        }
        const result_Order =  insertIntoDatabase(connection, data);
        console.log(data)
        connection.query('SELECT * FROM ChatBotForSMEsDB.Order' , (error, results, fields) => {
          for(let p = 0; p < results.length;p++){
            count = results[p].id;
            if(req.body.originalDetectIntentRequest.payload.data.sender.id == results[p].id)this.count = results[p].id;
          }
        });
        
        return queryDatabase(connection)
        .then(result => {

      //หาเห็ดหลินจือ 
      if(check == false){
        for(let b = 0; b < producttype1.length;++b){
          console.log(b)
          for(let v = 0; v < result.length; v++){
            if(producttype1[b] == result[v].Product_Name){
              if (number1[b] <= `${result[v].Product_Count}`){
                if (check != true){
                    plus = true
                      idProduct = CompareProduct(producttype1[b])    
                    var data2 = {
                      fk_order_id: this.count,
                      fk_product_id: idProduct,
                      od_qty: number1[b],
                    };  
                    console.log(count);
                    
                    console.log(data2);                
                }else{
                  agent.add('ขอโทษค่ะ กรุณาสั่งใหม่')
                }
              }else{
                agent.add('ขอโทษด้วยนะคะ ' + producttype1[b] + ' เหลืออยู่ ' + `${result[v].Product_Count} ถุงค่ะ` )
                plus2 = true
              }
            }
          }
          insertIntoDatabase2(connection, data2);
        }
        }else if(check == true && Flavormushroom != '' ){
          pdName = producttype1;
          for(let b = 0; b < producttype1.length;b++){
            if(producttype1[b] == 'เห็ดหลินจือ')pdName[b] = 'เห็ดหลินจือ สูตร'+ Flavormushroom;
            for(let v = 0; v < result.length; v++){                            
              if(pdName[b] == result[v].Product_Name){
                if (number1[b] <= `${result[v].Product_Count}`){
                  if(check == true && Flavormushroom != '' ){ 
                    console.log(pdName)
                    plus = true;
                      idProduct = CompareProduct(pdName[b]);       
                      var data2 = {
                        fk_order_id: this.count,
                        fk_product_id: idProduct,
                        od_qty: number1[b]
                      };
                    }      
                  else{
                    agent.add('ขอโทษค่ะ กรุณาสั่งใหม่')
                  }
                }else{
                  agent.add('ขอโทษด้วยนะคะ ' + producttype1[b] + ' เหลืออยู่ ' + `${result[v].Product_Count} ถุงค่ะ` )
                  plus2 = true;
                }
                          
              }
            }
            insertIntoDatabase2(connection, data2);            
          }         
          }else{
          prodName = producttype1;
          for (let n = 0; n < producttype1.length ; n++){
            if(prodName[n] == 'เห็ดหลินจือ'){
              prodName[n] += ' สูตร';
            }
          }
          count2 = count;
          agent.add('เห็ดหลินจือรับเป็นสูตรไหนดีคะ มีสูตรดั้งเดิมและสูตรเข้มข้น')
          agent.add('สูตรเข้มข้นจะขมพอทานได้และสูตรดั้งเดิมจะขมปานกลางค่ะ')
        }
        
        connection.end();
        if(plus == true && plus2 == false) {
          let richResponses = [
            {
              "quickReplies":{
                "title": "ต้องการขนส่งแบบไหนดีคะ มีบริการ Kerry และ Flash express และรองรับจ่ายเงินปลายทางค่ะ",
                
                "quickReplies":[
                  "Kerry",
                  "Flash express",
                  "Kerry(COD)",
                  "Flash express(COD)"
                ]
              },
              "plateform": "FACEBOOK"
            }
          ]
          responseJson.fulfillmentMessages = richResponses;
        res.json(responseJson);
        }
      }
      )
      })
      }
      
      function Order2(agent){      
        const {
          flavormushroom    
        } = agent.parameters; 
        
        let plus;
        let plus2 = false;
        return connectToDatabase()
        .then(connection => {
          return queryDatabase(connection)
          .then(result => {
        for (let n = 0; n < prodName.length ; n++){        
          if(prodName[n] == 'เห็ดหลินจือ สูตร'){
            prodName[n] += flavormushroom;
          }
        }
        for(let b = 0; b < prodName.length;b++){
          for(let v = 0; v < result.length; v++){
            if(prodName[b] == result[v].Product_Name){
              if (countProduct[b] <= `${result[v].Product_Count}`){
                      plus = true;
                        idProduct = CompareProduct(prodName[b])       
                      let data = {
                        fk_order_id: count2,
                        fk_product_id: idProduct,
                        od_qty: countProduct[b],
                      };  
                      
                    }else{
                      agent.add('ขอโทษด้วยนะคะ ' + prodName[b] + ' เหลืออยู่ ' + `${result[v].Product_Count} ถุงค่ะ` )
                      plus2 = true;
                    }
                  }
                }
                insertIntoDatabase2(connection, data);
              }
              if(plus == true && plus2 == false) {
                let richResponses = [
                  {
                    "quickReplies":{
                      "title": "ต้องการขนส่งแบบไหนดีคะ มีบริการ Kerry และ Flash express และรองรับจ่ายเงินปลายทางค่ะ",
                      
                      "quickReplies":[
                        "Kerry",
                        "Flash express",
                        "Kerry(COD)",
                        "Flash express(COD)"
                      ]
                    },
                    "plateform": "FACEBOOK"
                  }
                ]
                responseJson.fulfillmentMessages = richResponses;
              res.json(responseJson);
              }
              connection.end();
            })
          })
        }
  
  
    
    function CostCalculate(producttype, number){
      if (producttype =='เห็ดหลินจือ สูตร'){
        return 250*number;
      }
      else if (producttype == 'เห็ดหลินจือ สูตรเข้มข้น' || producttype == 'เห็ดหลินจือ สูตรดั้งเดิม'){
        return 250*number;
      }
      else if (producttype=='กระชายดำผสมงาดำ'){
        return 200*number
      }
      else if (producttype=='ฟ้าทลายโจรผสมกระชายขาว'){
        return 200*number
      }
      else if (producttype=='กระชายขาวผสมขิง'){
        return 200*number 
      }
      else if (producttype=='ถังเช่าสีทอง'){
        return 200*number
      }else{
        return 'no parameter'
      }
    }

    function CompareProduct(producttype){
      if (producttype=='เห็ดหลินจือ สูตรดั้งเดิม'){
        return 22;
      }
      else if (producttype=='กระชายดำผสมงาดำ'){
        return 23
      }
      else if (producttype=='ฟ้าทลายโจรผสมกระชายขาว'){
        return 25
      }
      else if (producttype=='กระชายขาวผสมขิง'){
        return 28 
      }
      else if (producttype=='ถังเช่าสีทอง'){
        return 29
      }
      else if (producttype=='เห็ดหลินจือ สูตรเข้มข้น'){
        return 24
      }
      else{
        return 'ไม่มีสินค้า'
      }
    }

    function ConvertIdToProduct(producttype){
      if (producttype==22){
        return 'เห็ดหลินจือ สูตรดั้งเดิม';
      }
      else if (producttype==23){
        return 'กระชายดำผสมงาดำ'
      }
      else if (producttype==25){
        return 'ฟ้าทลายโจรผสมกระชายขาว'
      }
      else if (producttype==28){
        return 'กระชายขาวผสมขิง'
      }
      else if (producttype==29){
        return 'ถังเช่าสีทอง'
      }
      else if (producttype==24){
        return 'เห็ดหลินจือ สูตรเข้มข้น'
      }
      else{
        return 'ไม่มีสินค้า'
      }
    }

    function DeliveryCost(type, cost, summaryQTY){
        if(type == 'Flash Express' || type == 'Kerry'){
            if(summaryQTY < 12 ){
              cost += 50;
            }
            else if(summaryQTY < 30 ){
              cost += 100;
            }
            else if (summaryQTY < 60 ){
              cost += 145;
            }
            else if (summaryQTY >= 60){
              cost += 200;
            }
            return cost;
        }else if (type == 'Flash Express (COD)' || type == 'Kerry (COD)'){
            if(summaryQTY < 12 ){
              cost += 50;
              cost += cost * (3/100);
            }
            else if(summaryQTY < 30 ){
              cost += 100;
              cost += cost * (3/100);
            }
            else if (summaryQTY < 60 ){
              cost += 145;
              cost += cost * (3/100);
            }
            else if (summaryQTY >= 60){
              cost += 200;
              cost += cost * (3/100);
          }
          return cost;
        }
    }

    function DelCost(summaryQTY){
          if(summaryQTY < 12 ){
            return 50;
          }
          else if(summaryQTY < 30 ){
            return 100;
          }
          else if (summaryQTY < 60 ){
            return 145;
          }
          else if (summaryQTY >= 60){
            return 200;
          }else{
            return 'something error'
          }
  }


    function Delivery(agent){
      const {
        deliverytype
      } = agent.parameters;
      deliveryType = deliverytype;
      let idVerify;
      let totalCost = 0;
      let cost = 0;
      let name = '';
      let temp = '';
      let delCost = 0;
      let summaryQTY = 0;
      let countString = '';

      return connectToDatabase()
      .then(connection => {
        connection.query('SELECT * FROM ChatBotForSMEsDB.Order' , (error, results, fields) => {
          for(let p = 0; p < results.length;p++){
            if(req.body.originalDetectIntentRequest.payload.data.sender.id == results[p].Order_SenderID && results[p].Order_Date == undefined){
              idVerify = results[p].id;
            }
          }                                      
        });
        return queryOrderDtDatabase(connection)
        .then(result => {
          for(let a = 0; a < result.length; a++){
            if(idVerify == result[a].fk_order_id){
              console.log(idVerify);
              summaryQTY += result[a].od_qty
              name = ConvertIdToProduct(result[a].fk_product_id)
              totalCost += CostCalculate(name, result[a].od_qty);
              cost = CostCalculate(name, result[a].od_qty);
              countString = result[a].od_qty.toString();
              temp += name + ' ' + countString + ' ชุด \n';
              console.log(temp)
              data = {
                idOrder_detail: result[a].idOrder_detail,
                od_total:cost
              }
              console.log(data)
              updateOdTotal(connection, data);
            }
          }
          delCost = DelCost(summaryQTY);
          totalCost = DeliveryCost(deliverytype,totalCost, summaryQTY);
          console.log(totalCost+' ราคารวมขนส่งแล้ว');
            data = {
              id: idVerify,
              Order_TotalCost: totalCost,
              Order_DeliveryType: deliverytype
            }
            console.log(data)
            updateOrTotal(connection,data)
          connection.end();
      if(deliverytype == 'Flash Express'){
          let richResponses = [
            {
              "quickReplies":{
                "title": "สั่งซื้อสินค้า\n"+temp+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "ค่าส่ง "+ delCost + " บาท\n" +"รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
                "quickReplies":[
                  "ยืนยัน",
                  "ยกเลิก",
                ]
              },
              "plateform": "FACEBOOK"
            }
          ]
          responseJson.fulfillmentMessages = richResponses;
          console.log(responseJson);
          res.json(responseJson);  
      }else if(deliverytype == 'Kerry'){
          let richResponses = [
            {
              "quickReplies":{
                "title": "สั่งซื้อสินค้า\n"+temp+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "ค่าส่ง "+ delCost + " บาท\n" +"รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                "quickReplies":[
                  "ยืนยัน",
                  "ยกเลิก",
                ]
              },
              "plateform": "FACEBOOK"
            }
          ]
          responseJson.fulfillmentMessages = richResponses;
          console.log(responseJson);
          res.json(responseJson); 
      }else if(deliverytype == 'Flash Express (COD)'){          
          let richResponses = [
            {
              "quickReplies":{
                "title": "สั่งซื้อสินค้า\n"+temp+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "ค่าส่ง "+ delCost + " บาท บวกปลายทาง 3% นะคะ\n" +"รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
                "quickReplies":[
                  "ยืนยัน",
                  "ยกเลิก",
                ]
              },
              "plateform": "FACEBOOK"
            }
          ]
          responseJson.fulfillmentMessages = richResponses;
          console.log(responseJson);
          res.json(responseJson); 
      }else if(deliverytype == 'Kerry (COD)'){
          let richResponses = [
            {
              "quickReplies":{
                "title": "สั่งซื้อสินค้า\n"+temp+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "ค่าส่ง "+ delCost + " บาท บวกปลายทาง 3% นะคะ\n" +"รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
                "quickReplies":[
                  "ยืนยัน",
                  "ยกเลิก",
                ]
              },
              "plateform": "FACEBOOK"
            }
          ]
          responseJson.fulfillmentMessages = richResponses;
          console.log(responseJson);
          res.json(responseJson); 
      }
      
    })
  })
    }

    function DeliveryYes(agent){
      statusDel = 'ยังไม่ได้ชำระเงิน(COD)';
      orderPayment = 'ยังไม่ได้ชำระเงิน(COD)';
      let idVerify = 0;
      return connectToDatabase()
      .then(connection => {
        connection.query('SELECT * FROM ChatBotForSMEsDB.Order' , (error, results, fields) => {
          for(let p = 0; p < results.length;p++){
            if(req.body.originalDetectIntentRequest.payload.data.sender.id == results[p].Order_SenderID && results[p].Order_Date == undefined){
              idVerify = results[p].id;
            }
          }                                      
        });
        return queryOrderDtDatabase(connection)
        .then(result => {
        data = {
          id: idVerify,
          Order_Status: statusDel,
          Order_Payment: orderPayment
        }
        updateOrTotal(connection,data)
        const imageUrl = 'https://media.discordapp.net/attachments/638022361454477322/965555830181220402/95510519_242757083597369_7226599770523959296_n.jpg?width=473&height=473'
        const anotherImage = new Image({
              imageUrl: imageUrl,
              platform: 'FACEBOOK'
          });
        if(deliveryType == 'Flash Express'){
          agent.add(anotherImage);
          agent.add("แจ้งสลิปพร้อมชื่อ - ที่อยู่ และเบอร์โทรนะคะ")
        }else if(deliveryType == 'Kerry'){
          agent.add(anotherImage);
          agent.add("แจ้งสลิปพร้อมชื่อ - ที่อยู่ และเบอร์โทรนะคะ")
        }else if(deliveryType == 'Flash Express (COD)'){
          agent.add("แจ้งที่อยู่พร้อมเบอร์โทรได้เลยค่ะ")        
        }else if(deliveryType == 'Kerry (COD)'){
          agent.add("แจ้งที่อยู่พร้อมเบอร์โทรได้เลยค่ะ")
        }
        connection.end();      
        })
      })
    }


    function Payment(agent){ // ส่งสลิปจ่ายเงินก่อน
        const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
        agent.add("ขอบคุณค่ะ อย่าลืมส่งชื่อ - ที่อยู่ และเบอร์โทรมาให้แอดมินนะ")
        console.log(imageUrl);
        statusDel = "รอการตรวจสอบ"
        orderPayment = imageUrl;
    }

    function PaymentAddress(agent){ // ส่งชื่อที่อยู่ เบอร์โทรให้หลังจากจ่ายเงินแล้ว
        const {
          address, phoneNumber, any
        } = agent.parameters;
        addressTemp = address;
        phoneNumberTemp = phoneNumber;
        cusName = any;
        console.log(cusName + " " + addressTemp + " " + phoneNumberTemp )
        agent.add("สั่ง " + prodName + " " + countProduct + " ชุด โดยบริการขนส่ง " + deliveryType + " ส่งที่คุณ " + req.body.queryResult.queryText +" นะคะ")
        agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ")
        
    }

    function GetAddress(agent){ // รับที่อยู่ก่อน
      const {
        address, phoneNumber, any
      } = agent.parameters;
        addressTemp = address;
        phoneNumberTemp = phoneNumber;
        cusName = any;
        console.log(req.body.queryResult.queryText)
        if(deliveryType == 'Flash Express'){
          console.log(cusName + " " + addressTemp + " " + phoneNumberTemp )     
          agent.add("เป็นชื่อที่อยู่นี้นะคะ")

        }else if(deliveryType == 'Kerry'){
          console.log(cusName + " " + addressTemp + " " + phoneNumberTemp )     
          agent.add("เป็นชื่อที่อยู่นี้นะคะ")

        }else if(deliveryType == 'Flash Express (COD)'){
          console.log(any + " " + address + " " + phoneNumber )
          agent.add("สั่ง " + prodName + " " + countProduct + " ชุด เป็นเงิน "+ totalCost +" บาท โดยบริการขนส่ง " + deliveryType + " ที่อยู่" + " " + req.body.queryResult.queryText +" นะคะ")
          agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ") 

        }else if(deliveryType == 'Kerry (COD)'){
          console.log(any + " " + address + " " + phoneNumber )
          agent.add("สั่ง " + prodName + " " + countProduct + " ชุด เป็นเงิน "+ totalCost +" บาท โดยบริการขนส่ง " + deliveryType + " ที่อยู่" +  " " + req.body.queryResult.queryText +" นะคะ")
          agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ") 
        }
    }

    function AddressPayment(agent){ // จ่ายเงินหลังจากส่งชื่อที่อยู่ เบอร์โทร
      const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
      agent.add("สั่ง " + prodName + " " + countProduct + " ชุด เป็นเงิน "+ totalCost +" บาท โดยบริการขนส่ง " + deliveryType + " ที่อยู่ " + cusName + " " + addressTemp + " " + phoneNumberTemp  +" นะคะ")
      agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ")    
      console.log(imageUrl);
      orderPayment = imageUrl;
      statusDel = 'รอการตรวจสอบ';
    }

    function myTrim(x) {
      return x.replace(',');
    }

  function getProdId(){
    return connectToDatabase()
        .then(connection => {
          return queryOrderDatabase(connection)
          .then(result2 => {
            for(let n = 0; n <= result2.length; ++n){
              if(result2[n].Order_SenderID == req.body.originalDetectIntentRequest.payload.data.sender.id && result2[n].Order_Date == null){
                a = (result2[n].id);   
                this.count = a;      
              }
            }             
          connection.end();
        })
      })
  }

    async function WriteOrder(agent){  
      addressTemp = myTrim(addressTemp);
      let updateQty = 0;
      getProdId();
      currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      var data = {
        Order_Date: currentDate,
        Order_DeliveryType: deliveryType,
        Order_Status: statusDel,
        Order_CusName: cusName,
        Order_CusTel: phoneNumberTemp,
        Order_CusAdd: addressTemp,
        Order_Tracking: tracking,
        Order_SenderID: senderId,
        Order_Payment: orderPayment,
        Order_TotalCost: totalCost
      }; 
      const connection = await connectToDatabase();
      const result_Order = await insertIntoDatabase(connection, data);
      
      count +=1
      console.log(count)
      for (let a = 0; a < prodName.length ; a++){
        idProduct = CompareProduct(prodName[a])       
      var data2 = {
        fk_order_id: count,
        fk_product_id: idProduct,
        od_qty: countProduct[a],
        od_total: totalCost
      };  

      console.log(count);
      const result_detail = await insertIntoDatabase2(connection, data2);
      }      
      connection.end();

      return connectToDatabase()
      .then(connection => {
        return queryDatabase(connection)
        .then(result => {

          for( let b = 0; b < prodName.length; b++){
            for(let m = 0; m < result.length;m++){
              if(prodName[b] == result[m].Product_Name){
                updateQty = result[m].Product_Count - countProduct[b];
                console.log(updateQty)
                updateProductCount(result[m].idProduct,updateQty);
              }
            }
          }
          connection.end();
          clearOrder();
          agent.add(`เก็บเรียบร้อย`);
        })
      })      
      }
   
    function clearOrder(){
      prodName = [];
      countProduct = 0;
      totalCost = 0;
      summaryQTY = 0;
      delCost = 0;
      deliveryType = '';
      statusDel = '';
      cusName = '';
      cusAdd = '';
      cusTel = '';
      currentDate = '';
      tracking = 'ยังไม่มีพัสดุ';
      addressTemp = '';
      phoneNumberTemp = '';
      givenNameTemp = '';
      lastNameTemp = '';
      senderId = '';
      idProduct = '';
      orderPayment = '';
      count = 0;
      temp = '';
      countString = '';
    }

    var intentMap = new Map();
    intentMap.set('เรียกดูสินค้า',product)
    intentMap.set('OrderIn', WriteOrder)
    intentMap.set('properties', properties)
    intentMap.set('สั่งสินค้า', Order)
    intentMap.set('สั่งสินค้า - custom', Order2)
    intentMap.set('Payment', Payment)
    intentMap.set('Payment - custom', PaymentAddress)
    intentMap.set('DeliveryChoose', Delivery)
    intentMap.set('DeliveryChoose - yes', DeliveryYes)
    intentMap.set('Address', GetAddress)
    intentMap.set('Address - custom', AddressPayment)
    agent.handleRequest(intentMap);
});
