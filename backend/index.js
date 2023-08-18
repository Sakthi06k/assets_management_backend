const express = require('express')
const app = express()
const cors = require("cors");
const user = require("./schema")
const mongoose = require("mongoose")
require("dotenv").config();

app.use(cors());

app.use(express.json());
//mongodb://127.0.0.1:27017/Assert
var database = mongoose.connect("mongodb+srv://sakthi:root@assestmanagement.erqwis7.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database connected successfully'))
    .then(() => {
        app.listen(5000, function (req, res) {
            console.log("Stating at 5000 server")
        })
    })
    .catch(err => console.log('Database connection error: ' + err));

app.post('/Login', async (req, res) => {
    console.log(req.body)
    const findmail = await user.findOne({ email: req.body.loginEmail, password: req.body.loginPass });
    if (findmail) {
        res.json({ status: "ok" });
    }
    else {
        res.json({ status: "failed" });
    }

});

app.post('/Register', async (req, res) => {
    const adduser = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })
    const findmail = await user.findOne({ email: req.body.email });
    if (findmail) {
        console.log("Email Already exists");
        res.json({ status: "failed" });
    } else {
        adduser.save().then(() => {
            console.log("inserted successfully");
        });
        res.json({ status: "ok" });
    }
    console.log(adduser)
})

app.get('/Home/:email', async (req,res) => {
    const {email} = req.params;
    const curUser = await user.findOne({email : email})
    console.log(curUser);
    res.json({status:"ok",asserts: curUser.asserts,userDetials: curUser})
})

app.post('/AddAsserts', async (req, res) => {
    try{
        let newAssert = req.body;
        let email = req.body.email;
        console.log(newAssert);
        delete newAssert.email;
        console.log(newAssert);
        let curUser = await user.findOne({email : email})
        curUser.asserts.push(newAssert);
        curUser.save();
        res.json({status:"ok"})
    }
    catch(err){
        res.json({status:"failed"})
    }
})

app.delete('/deleteAssert/:id/:email',async (req,res) => {
    const {id,email} = req.params;
    try{
        let curUser = await user.findOne({email: email});
        curUser.asserts.splice(id,1);
        curUser.save();
        res.json({status:"ok"})
    } catch(err) {
        res.json({status:"failed"})
    }
})
app.post("/UpdateAsserts",async (req,res) => {
    const data = req.body;
    try{
        const curUser = await user.findOne({email: data.email});
        const newAssert = {
            title: data.title,
            asserts: data.asserts,
            quantity: data.quantity,
            price: data.price
        }
        curUser.asserts[data.ind] = newAssert;
        console.log(curUser);
        curUser.save();
        res.json({status:"ok"})
    } catch {
        res.json({status:"failed"})
    }
})

app.post('/Profile/:email',async(req,res)=>{
    const {email} = req.params;
    const findOne = await user.findOne({email:email});
    if(findOne.password===req.body.pass){
    findOne.firstName=req.body.firstname
    findOne.lastName=req.body.lastname
    findOne.email=req.body.email
    findOne.save();
    res.json({status:"ok"});
    }else{
        res.json({status:"failed"});
    }
})

app.get('/GenerateReport/:email', async (req,res) => {
    const {email} = req.params;
    const curUser = await user.findOne({email : email})
    console.log("-----------------------");
    console.log(curUser);
    console.log(email);
    console.log("-----------------------");
    res.json({status:"ok",userDetials: curUser})
})

app.post("/ChangePass",async(req,res)=>{
    const findOne = await user.findOne({email:req.body.myEmail});
    console.log(findOne);
    if(findOne){
        findOne.password=req.body.pass
        findOne.save();
        res.json({status:"ok"})
    }
    else{
        res.json({status:"failed"})
    }
    
    
})

app.post("/ValidatePass",async(req,res)=>{
    const findOne = await user.findOne({email:req.body.myEmail});
    if(findOne){
if(findOne.password.includes(req.body.knownPass)&&req.body.knownPass.length>=3){
        res.json({status:"ok"})
    }else{
        res.json({status:"failed"})
    }
    }
    
})