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
form = [];
timedate = new Date();
Status = "ยังไม่ได้ชำระเงิน";
totalCost = 0;
Tracking = "";
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
        var a = connection.escape(timedate);
        connection.query('INSERT INTO Order SET ?'+ /*',Order_Date ='+connection.escape(timedate),*/ data, (error, results, fields) => {
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
            /*agent.add(`ชื่อสินค้า: ${user.Product_Name}`);
            agent.add(`จำนวน: ${user.Product_Count}`);
            agent.add(`วันหมดอายุ: ${user.Product_Expire}`);
            agent.add(`ราคา: ${user.Product_Cost}`);
            agent.add(`ราคา: ${user.Product_Detail}`);*/
            
            const card = new Card(`${user.Product_Name} ราคา: ${user.Product_Cost}`);
            card.setImage(`${user.Product_Picture}`);
            card.setText(`${user.Product_Detail}`);
            card.setButton({text: `สั่งเลย`, url:`${user.Product_Name}`});
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
      Order_form(producttype1, number1);
      agent.add("---- รวมเป็นเงิน ----")
      agent.add("ลูกค้าต้องการบริการส่งสินค้าในรูปแบบไหนดีคะ มี Kerry กับ Flash Express ค่ะ จ่ายปลายทางก็มีนะคะ")
    }
    
    function Order_form(a, b){
        form.push(a, b);
        console.log(form)
        return form;
    }

    function Kerry(agent){
      const {
        deliverytype      
      } = agent.parameters;
      Order_form(deliverytype, Status);
      agent.add("--ยอดสินค้าที่ต้องชำระเงิน--")
      agent.add("โอนผ่านธนาคาร กสิกร xxx x xxxxx x ไทยพาณิชย์ xxx x xxxxx x กรุงศรี xxx x xxx xx x ออมสิน xxx xxx xxx xxx")
      agent.add("โอนแล้วแจ้งสลิปพร้อมที่อยู่และเบอร์โทรนะคะ")
    }

    function Cus_Address(agent){
      const {
        location, phone
      } = agent.parameters;
      Order_form(location, phone);
      agent.add("สินค้าจะจัดส่งภายใน 1-2 วันนะคะ ถ้าสินค้าจัดส่งแล้วจะมาแจ้งเลขพัสดุในนี้นะคะ ขอบคุณมากค่ะ")
    }

    function Payment(agent){
      const {
        Payment
      } = agent.parameters;
      Order_form(Tracking, totalCost);
      agent.add("สินค้าจะจัดส่งภายใน 1-2 วันนะคะ ถ้าสินค้าจัดส่งแล้วจะมาแจ้งเลขพัสดุในนี้นะคะ ขอบคุณมากค่ะ")
    }

    function Calculate(productName, count){
      total = count + cost;
    }

    async function WriteOrder(agent){
      const connection = await connectToDatabase();
      a = (connection.escape(timedate));
      const data = {
        Order_CountProduct: 3,
        Order_TotalCost: 800,
        Order_Date: a,
        Order_Status: `ยังไม่ชำระเงิน`,
        Order_CusName: `อรรถพล ตันติวัฒนะผล`,
        Order_CusTel: `0827754150`,
        Order_CusAdd: `110/9 ม.5 ต.บึง อ.ศรีราชา จ.ชลบุรี`,
        Order_DeliveryType: `Kerry`,
        Order_Tracking: `none`,
        Product_idProduct: 22,
        Payment_idPayment: 5
      };
      
      const result_2 = await insertIntoDatabase(connection, data);      
      agent.add(`เก็บเรียบร้อย`);
      console.log(form);
      form = [];
      console.log(form);
      console.log(data);
      connection.end();
      }

      async function test1(agent){
        const {
        any, number
      } = agent.parameters;

        const data = {
          User_Fname : any[0],
          User_Sname: any[1],
          User_Password: any[2],
          User_Othername: any[3],
          User_Permission: 1,
          User_Location: any[4]
        };
        const connection = await connectToDatabase();
        const result_2 = await insertIntoDatabase(connection, data);
        agent.add(`เก็บเรียบร้อย`);
        console.log(data);
        console.log(any);
        connection.end();
        }

        

    var intentMap = new Map();
    intentMap.set('เรียกดูสินค้า',product)
    intentMap.set('OrderIn', WriteOrder)
    intentMap.set('สั่งสินค้า', Order)
    intentMap.set('Delivery.Kerry', Kerry)
    intentMap.set('รับที่อยู่', Cus_Address)
    intentMap.set('Payment', Payment)
    intentMap.set('test', test1)
    agent.handleRequest(intentMap);
});
