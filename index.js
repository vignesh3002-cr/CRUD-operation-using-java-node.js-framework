import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app=express();
const port=3000;
const db=new pg.Client({
    user:"postgres",
    password:"3002",
    database:"college",
    host:"localhost",
    port:5432,
});
db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const head=" Fill this form with your personal details.";
const tit="You can make  changes here.";
app.get("/",async(req,res)=>{
    try{
        const result=await db.query("select * from appliers");
        let datas=result.rows;
        res.render("index.ejs",{
            studentdatas:datas
        });
    }catch(err){
        console.log(err);
    }
});
app.post("/add",(req,res)=>{
    res.render("index.ejs",{head:head });
});
app.post("/submited",async(req,res)=>{
    const name=req.body.newname;
    const mob=req.body.newmobile;
    const college=req.body.newcollege;
    const course=req.body.newcourse;
    const email=req.body.newemail;
    try{
        await db.query("insert into  appliers(name,mobile_no,colleg_name,course_name,email) values ($1,$2,$3,$4,$5)",[name,mob,college,course,email]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }

});
app.post("/delete",async(req,res)=>{
    const id=req.body.deletedatasid;
    try{
        await db.query("delete from appliers where id=$1",[id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});
app.post("/edit",async(req,res)=>{
    const edit=req.body.edit;
    try{
        const result=await db.query("select * from appliers where id=$1",[edit]);
        let ed=result.rows[0];
        res.render("index.ejs",{tit:tit,up:ed});
    }catch(err){
        console.log(err);
    }
});
app.post("/updated",async(req,res)=>{
    const name=req.body.updatename;
    const mob=req.body.updatemobile;
    const college=req.body.updatecollege;
    const course=req.body.updatecourse;
    const email=req.body.updateemail;
    const id=req.body.updateid;
    try{
        db.query("update appliers set name=$1 where id=$2",[name,id]);
        db.query("update appliers set mobile_no=$1 where id=$2",[mob,id]);
        db.query("update appliers set colleg_name=$1 where id=$2",[college,id]);
        db.query("update appliers set course_name=$1 where id=$2",[course,id]);
        db.query("update appliers set email=$1 where id=$2",[email,id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});
app.post("/read",async(req,res)=>{
    const view=req.body.view;
    try{
        const result=await db.query("select * from appliers where id=$1",[view]);
        const rd=result.rows[0];
        res.render("index.ejs",{rd:rd});
    }catch(err){
        console.log(err);
    }
});
app.post("/viewed",async(req,res)=>{
    res.redirect("/");
});
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});
