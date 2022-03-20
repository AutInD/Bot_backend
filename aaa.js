
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
const getFacebookIds = require('get-facebook-id');
const VERIFY_TOKEN = 'Jamemo';
prodName = '';
form = [];
timedate = new Date();
countProduct = 0;
totalCost = 0;
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

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

  app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
});
app.get('/', function (_req, res) {
  res.send('Hello World');
});

app.post('/webhook', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({request : req,response : res});
    JSON.stringify(req.headers);
    JSON.stringify(req.body);
    console.log(req);
      let action = req.body.queryResult.action; 
      console.log(action);
      let responseJson = {};
    responseJson.fulfillmentText = 'This is an endpoint published to RunKit'; // displayed response 



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

    function insertIntoDatabase(connection, data){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO ChatBotForSMEsDB.Order SET ?',  data, (error, results, fields) => {
          resolve(results);
        });
      });
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
            const card = new Card(`${user.Product_Name} ราคา: ${user.Product_Cost}`);
            card.setImage(`https://8c44-1-46-158-203.ngrok.io/${user.Product_Picture}`);
            card.setText(`${user.Product_Detail}`);
            card.setButton({text: `สั่ง`+user.Product_Name, url:`${user.Product_Name}`});
            agent.add(card);

            
          }
        }); agent.add("สินค้าของทางร้านขายสมุนไพรชงดื่มเลือกซื้อได้เลยค่ะ")
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
        producttype1, number1      
      } = agent.parameters;
      countProduct = number1;
      prodName = producttype1
      totalCost = CostCalculate(producttype1, number1);
      currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      /*Order_form('Order_CountProduct: '+number1);
      Order_form('Order_TotalCost: '+CostCalculate(producttype1, number1));
      Order_form('Order_Date: '+moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));*/ 
      
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
        console.log(responseJson);
        res.json(responseJson);  
        agent.add("ต้องการสินค้า "+producttype1+" เป็นจำนวน "+number1+ " ชุดนะคะ")
        agent.add("รวมเป็นเงิน "+totalCost+" บาท")
        agent.add("ต้องการขนส่งแบบไหนดีคะ มีบริการ Kerry และ Flash express และรองรับจ่ายเงินปลายทางค่ะ")
      

      /*agent.add(new Suggestion('Flash Express'));
      agent.add(new Suggestion('Flash Express(COD)'));
      agent.add(new Suggestion('Kerry'));
      agent.add(new Suggestion('Kerry(COD)'));*/
      
      }
  
  
    
    function CostCalculate(producttype, number){
      if (producttype=='เห็ดหลินจือ'){
        return 360*number;
      }
      else if (producttype=='กระชายดำผสมงาดำ'){
        return 250*number
      }
      else if (producttype=='ฟ้าทลายโจรผสมกระชายขาว'){
        return 180*number
      }
      else if (producttype=='กระชายขาวผสมขิง'){
        return 250*number 
      }
      else if (producttype=='ถังเช่าสีทอง'){
        return 350*number
      }
    }

    function CompareProduct(producttype){
      if (producttype=='เห็ดหลินจือ'){
        return 22;
      }
      else if (producttype=='กระชายดำผสมงาดำ'){
        return 23
      }
      else if (producttype=='ฟ้าทลายโจรผสมกระชายขาว'){
        return 24
      }
      else if (producttype=='กระชายขาวผสมขิง'){
        return 25 
      }
      else if (producttype=='ถังเช่าสีทอง'){
        return 26
      }
      else{
        return 'ไม่มีสินค้า'
      }
    }

    
    function Order_form(inform){
        form.push(inform);
        return form;
    }


    function Delivery(agent){
      const {
        deliverytype
      } = agent.parameters;
      deliveryType = deliverytype;
      statusDel = 'ยังไม่ได้ชำระเงิน';
      if(deliverytype == 'Flash Express'){
          let richResponses = [
            {
              "quickReplies":{
                "title": "สั่งซื้อสินค้า "+prodName+" "+countProduct+" ชุด"+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
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
                "title": "สั่งซื้อสินค้า "+prodName+" "+countProduct+" ชุด"+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
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
                "title": "สั่งซื้อสินค้า "+prodName+" "+countProduct+" ชุด"+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
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
                "title": "สั่งซื้อสินค้า "+prodName+" "+countProduct+" ชุด"+ "โดยใช้บริการขนส่งแบบ "+ deliverytype + "\n\n" + "รวมเป็นเงิน "+ totalCost +" บาท \n\n" + "คุณลูกค้ายืนยันออเดอร์นี้นะคะ",
                
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
    }

    function DeliveryYes(agent){
      if(deliveryType == 'Flash Express'){
        agent.add("ชำระเงินผ่านธนาคาร กสิกร xxx x xxxxx x ไทยพาณิชย์ xxx x xxxxx x กรุงศรี xxx x xxx xx x ออมสิน xxx xxx xxx xxx")
        agent.add("โอนแล้วแจ้งสลิปพร้อมที่อยู่และเบอร์โทรนะคะ")
      }else if(deliveryType == 'Kerry'){
        agent.add("ชำระเงินผ่านธนาคาร กสิกร xxx x xxxxx x ไทยพาณิชย์ xxx x xxxxx x กรุงศรี xxx x xxx xx x ออมสิน xxx xxx xxx xxx")
        agent.add("โอนแล้วแจ้งสลิปพร้อมที่อยู่และเบอร์โทรนะคะ")
      }else if(deliveryType == 'Flash Express (COD)'){
        agent.add("ราคาทั้งหมดที่ต้องชำระเป็น "+ totalCost +" บาทนะคะ")
        agent.add("แจ้งที่อยู่พร้อมเบอร์โทรได้เลยค่ะ")
      }else if(deliveryType == 'Kerry (COD)'){
        agent.add("ราคาทั้งหมดที่ต้องชำระเป็น "+ totalCost +" บาทนะคะ")
        agent.add("แจ้งที่อยู่พร้อมเบอร์โทรได้เลยค่ะ")
      }
    }

    function Cus_Address(agent){
      const {
        any, phone, name
      } = agent.parameters;
      cusName = name;
      cusTel = phone;
      cusAdd = any;
      tracking = 'None';
      /*Order_form('Order_CusName: '+name);
      Order_form('Order_CusTel: '+phone);
      Order_form('Order_CusAdd: '+any);
      Order_form('Order_Tracking: '+'None');*/
      agent.add("ส่งให้ภายใน 1-2 วันนี้นะคะ")
    }

    function Payment(agent){ // ส่งสลิปจ่ายเงินก่อน
        const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
        agent.add("ขอบคุณค่ะ อย่าลืมส่งชื่อ - ที่อยู่ และเบอร์โทรมาให้แอดมินนะ")
        console.log(imageUrl);
    }

    function PaymentAddress(agent){ // ส่งชื่อที่อยู่ เบอร์โทรให้หลังจากจ่ายเงินแล้ว
        const {
          address, phoneNumber, givenName, lastName
        } = agent.parameters;
        console.log(givenName + " " + lastName + " " + address + " " + phoneNumber )
        agent.add("สั่ง " + prodName + " " + countProduct + " ชุด โดยบริการขนส่ง " + deliveryType + " ส่งที่คุณ" + givenName + " " + lastName + " " + address + " " + phoneNumber +" นะคะ")
        agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ")
    }

    function GetAddress(agent){ // รับที่อยู่ก่อน
      const {
        address, phoneNumber, givenName, lastName
      } = agent.parameters;
        addressTemp = address;
        phoneNumberTemp = phoneNumber;
        givenNameTemp = givenName;
        lastNameTemp = lastName;
        console.log(givenName + " " + lastName + " " + address + " " + phoneNumber )

        agent.add("เป็นชื่อที่อยู่นี้นะคะ")
    }

    function AddressPayment(agent){ // จ่ายเงินหลังจากส่งชื่อที่อยู่ เบอร์โทร
      const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
      agent.add("สั่ง " + prodName + " " + countProduct + " ชุด เป็นเงิน "+ totalCost +" บาท โดยบริการขนส่ง " + deliveryType + " ส่งที่คุณ" + givenNameTemp + " " + lastNameTemp + " " + addressTemp + " " + phoneNumberTemp +" นะคะ")
      agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ")    
      console.log(imageUrl);
    }

    function GetAddressCOD(agent){
        const {
          address, phoneNumber, givenName, lastName
        } = agent.parameters;
        console.log(givenName + " " + lastName + " " + address + " " + phoneNumber )
        agent.add("สั่ง " + prodName + " " + countProduct + " ชุด เป็นเงิน "+ totalCost +" บาท โดยบริการขนส่ง " + deliveryType + " ส่งที่คุณ" + givenName + " " + lastName + " " + address + " " + phoneNumber +" นะคะ")
        agent.add("สินค้าจะส่งภายใน 1-2 วันนะคะ ส่งแล้วจะแปะเลขในนี้ ขอบคุณมากค่ะ")    
    }

    async function WriteOrder(agent){  
      console.log(data);
      var data = {
        Order_CountProduct: countProduct,
        Order_TotalCost: totalCost,
        Order_DeliveryType: deliveryType,        
        Order_Status: statusDel,
        Order_CusName: cusName,
        Order_CusAdd: cusAdd,
        Order_CusTel: cusTel,
        Order_Date: currentDate,        
        Order_Tracking: tracking,
      };
      console.log(data);
      const connection = await connectToDatabase();
      const result_2 = await insertIntoDatabase(connection, data);
      agent.add(`เก็บเรียบร้อย`);
      form = [];
      connection.end();
      }
        

    var intentMap = new Map();
    intentMap.set('เรียกดูสินค้า',product)
    intentMap.set('OrderIn', WriteOrder)
    intentMap.set('สั่งสินค้า', Order)
    intentMap.set('รับที่อยู่', Cus_Address)
    intentMap.set('Payment', Payment)
    intentMap.set('Payment - custom', PaymentAddress)
    intentMap.set('DeliveryChoose', Delivery)
    intentMap.set('DeliveryChoose - yes', DeliveryYes)
    intentMap.set('Address', GetAddress)
    intentMap.set('Address - custom', AddressPayment)
    intentMap.set('AddressCOD', GetAddressCOD)
    /*intentMap.set('test', test1)*/
    agent.handleRequest(intentMap);
});
