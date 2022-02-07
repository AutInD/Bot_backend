const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const port = 3000;
const mysql = require('mysql');
const {Image} = require('dialogflow-fulfillment');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');
const { DateTime } = require('actions-on-google');
const moment = require('moment');
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
tracking = '';
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
      totalCost = CostCalculate(producttype1, number1);
      currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      /*Order_form('Order_CountProduct: '+number1);
      Order_form('Order_TotalCost: '+CostCalculate(producttype1, number1));
      Order_form('Order_Date: '+moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));*/
      agent.add("---- รวมเป็นเงิน ----")
      agent.add("ลูกค้าต้องการบริการส่งสินค้าในรูปแบบไหนดีคะ มี Kerry กับ Flash Express ค่ะ จ่ายปลายทางก็มีนะคะ")
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

    function Kerry(agent){
      const {
        deliverytype      
      } = agent.parameters;
      deliveryType = deliverytype;
      statusDel = 'ยังไม่ได้ชำระเงิน';
      /*Order_form('Order_DeliveryType: '+deliverytype);
      Order_form('Order_Status: '+'ยังไม่ได้ชำระเงิน');*/
      agent.add("--ยอดสินค้าที่ต้องชำระเงิน--")
      agent.add("โอนผ่านธนาคาร กสิกร xxx x xxxxx x ไทยพาณิชย์ xxx x xxxxx x กรุงศรี xxx x xxx xx x ออมสิน xxx xxx xxx xxx")
      agent.add("โอนแล้วแจ้งสลิปพร้อมที่อยู่และเบอร์โทรนะคะ")
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
      agent.add("สินค้าจะจัดส่งภายใน 1-2 วันนะคะ ถ้าสินค้าจัดส่งแล้วจะมาแจ้งเลขพัสดุในนี้นะคะ ขอบคุณมากค่ะ")
    }

    function Payment(agent){
      const {
        Payment
      } = agent.parameters;
      form.pop();
      form.push('Order_Status: '+'ชำระเงินแล้ว');
      agent.add("เงินเข้าแล้วค่ะ ขอชื่อที่อยู่และเบอร์โทรศัพท์ด้วยนะคะ")
      console.log(form);
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
    intentMap.set('Delivery.Kerry', Kerry)
    intentMap.set('รับที่อยู่', Cus_Address)
    intentMap.set('Payment', Payment)
    /*intentMap.set('test', test1)*/
    agent.handleRequest(intentMap);
});
