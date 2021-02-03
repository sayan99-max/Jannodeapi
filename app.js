const express=require('express');
const app=express();
const port=9900;
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const bodyParser=require('body-parser');
const cors=require('cors');
const mongourl="mongodb://localhost:27017";
//const mongourl="mongodb+srv://sayan:sayan@99@cluster0.tskhr.mongodb.net/edunov?retryWrites=true&w=majority";
let db;


app.use(cors());
//encode data while insert
app.use(bodyParser.urlencoded({exteded:true}));
app.use(bodyParser.json());


/*app.listen(port,function(err){
    if (err) throw err;
    console.log(`server is running on port number ${port}`);*/

//health ok
app.get('/',(req,res) => {
    res.send("health ok");
    });
    

//location route or city route
app.get('/location',(req,res) => {

    let limit=0;
    let sort={city_name:1};

    if(req.query.limit){
        limit=Number(req.query.limit);
    }
    else if(req.query.sort){
        sort={city_name:Number(req.query.sort)};
    }
    else if(req.query.limit && req.query.sort){
        limit=Number(req.query.limit);
        sort={city_name:Number(req.query.sort)};
    }


    db.collection('location').find().limit(limit).sort(sort).toArray((err,result) =>{
        if (err) console.log(err);
        res.send(result);  
    })
});

 //mealtype route
 app.get('/mealtype',(req,res) => {
  
 db.collection('mealtype').find().toArray((err,result) =>{
    if (err) console.log(err);
    res.send(result);  
})
});

 //mealtype route
 app.get('/mealtype',(req,res) => {
       db.collection('mealtype').find().toArray((err,result) =>{
       if (err) console.log(err);
       res.send(result);  
   })
   });
   

//cuisine route
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find().toArray((err,result) =>{
       if (err) console.log(err);
       res.send(result);  
   })
   });


      //restaurant per city
      app.get('/restaurant/:id',(req,res) => {
          var id=req.params.id;
        db.collection('restaurant').find({city:id}).toArray((err,result) =>{
           if (err) console.log(err);
           res.send(result);  
       })
       });
    
   //restaurant route
    app.get('/restaurant',(req,res) => {

        var condition={};  //query param


        //get restaurant on basis of city
           if (req.query.city) {
            condition={city:req.query.city}
           }
        
        //get restaurant on basis of meal-type
           else if (req.query.mealtype) {
                condition={"type.mealtype":req.query.mealtype}
            }

        //get restaurant on basis of city and  meal-type
        else if (req.query.city && req.query.mealtype) {
            condition={$and:[{city:req.query.city},{"type.mealtype":req.query.mealtype}]}
           }

           //get restaurant on basis of cuisine and  meal-type
        else if (req.query.cuisine && req.query.mealtype) {
            condition={$and:[{"Cuisine.cuisine":req.query.cuisine},{"type.mealtype":req.query.mealtype}]}
           }

             //get restaurant on basis of  meal-type and cost
        if (req.query.mealtype && req.query.lcost && req.query.hcost) {

            condition={$and:[{"type.mealtype":req.query.mealtype},{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
           }



        db.collection('restaurant').find(condition).toArray((err,result) =>{
        if (err) console.log(err);
            res.send(result);  
        })
        });
        


//place order
app.post('/placeorder',(req,res) => {
    db.collection('orders').insert(req.body,(err,ans) =>{
    if (err) throw(err);
    res.status(200).send('Data Added');  
})
});

//to get list of orders
 //'API' To see list of students
    app.get('/getOrder',(req,res) => {
    db.collection('orders').find().toArray((err,ans) =>{
    if (err) throw err;
    res.status(200).send(ans);  
})
});




   
    MongoClient.connect(mongourl,(err,connection) => {
        if (err) console.log(err);
        db=connection.db('edunov');

        app.listen(port,(err) => {
            if (err) throw err;
            console.log(`server is running on port number ${port}`);
        })
    
    })  

    
    

