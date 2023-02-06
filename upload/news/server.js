//common.js 구문
//모듈 import --> require("모듈")
//express
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//서버생성
const app =  express(); 
//프로세서의 주소 포트번호 지정 
const port = 8080;
//브라우저의 cors이슈를 막기 위해 설정
app.use(cors());
//josn 형식의 데이터를 처리하도록 설정
app.use(express.json());
//upload 폴더 클라이언트에 접근 가능하도록 설정
app.use("/upload",express.static("upload"));
//storage 생성 
const storage = multer.diskStorage({
    destination: (req, file, cd)=>{
        cd(null, 'upload/news/');
    },
    filename: (req, file, cd)=>{
        const newFilename = file.originalname;
        cd(null, newFilename)
    },
})
//upload 객체 생성하기
const upload = multer({storage:storage});
//upload 경로로 post 요청시 응답 구하기
app.post("/upload", upload.single("file"),(req,res)=>{
    res.send({
        imageUrl : req.file.filename
    })
})
//mysql 연결하기 
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "news" 
})
//선연결하기
conn.connect();
//conn.query(쿼리문, 콜백함수) 
app.get("/special",(req,res)=>{
    conn.query("select * from event where e_category = 'special'",
    (error,result,fields) => { 
         res.send(result);
    })
})
//http://localhost:8080/special/1
app.get("/special/:no",(req,res)=>{
    const {no} = req.params;
    conn.query(`select * from event where e_category = 'special' and e_no=${no}`,
     (error,result,fields)=>{
        res.send(result);
   })
})

//서버를 구동 
app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.");
})    
