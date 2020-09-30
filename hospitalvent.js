
const express=require("express");
const app=express();

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbname='hospitalInventory';

let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);

    db=client.db(dbname);
    console.log('Connected: ${url}');
});

app.get('/hospital',(req,res)=>{
    console.log("Hospital details");
    var data=db.collection('hospital').find().toArray().then(result=>res.json(result));
});


app.get('/ventilator',(req,res)=>{
    console.log("ventilator details");
    var data=db.collection('ventilator').find().toArray().then(result=>res.json(result));
    
});


app.post('/searchventilatorbystatus',(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var data=db.collection('ventilator').find({status:status}).toArray().then(result=>res.json(result));
    
});

app.post('/searchventilatorbyhosname',(req,res)=>{
    var name=req.query.name;
    console.log("ventilator details by hospital name");
    var data=db.collection('ventilator').find({name:new RegExp(name,'i')}).toArray().then(result=>res.json(result));
    
});

app.post('/searchhospital',(req,res)=>{
    var t=req.query.hname;
    var query={hname:t};
    
    console.log("searching");
    var data=db.collection('hospital').find(query).toArray(function(err,result)
    {
        if(err) throw err;
        res.json(result);
    });
    
});

app.put('/update',(req,res)=>{
    var vid={vid:req.body.vid};
    console.log(vid);
    var query={$set:{status:req.body.status}};
    
    console.log("searching");
    var data=db.collection('ventilator').updateOne(vid,query,function(err,result)
    {
        if(err) throw err;
        res.json("updated");
    });
    
});



app.post('/addvent',(req,res)=>{
    
    var vid=req.body.vid;
    var hid=req.body.hid;
    var name=req.body.name;
    var status=req.body.status;
    var item={vid:vid,hid:hid,name:name,status:status};
    
    console.log("inserting");
    var data=db.collection('ventilator').insertOne(item,function(err,result)
    {
        if(err) throw err;
        res.json("item inserted");
    });
    
});


app.post('/inserthos',(req,res)=>{
    var hid=req.body.hid;
    var hname=req.body.hname;
    var item={hid:hid,hname:hname};
    
    console.log("inserting");
    var data=db.collection('hospital').insertOne(item,function(err,result)
    {
        if(err) throw err;
        res.json(result);
    });
    
});


app.delete('/deletevent',(res,req)=>{
    var vid=req.body.vid;
    console.log(vid);
    var myquery={vid:vid};

    var data=db.collection('ventilator').deleteOne(myquery,function(err,result)
    {
        if(err) throw err;
        res.json("1 doc deleted");
    });
    
});




app.listen(3000);