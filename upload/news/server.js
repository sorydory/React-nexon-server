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
        cd(null, 'upload/event/');
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
    database: "hotel" 
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



//회원가입 요청
app.post("/join", async(req,res)=>{
    const mytextpass = req.body.m_pass;
    let myPass = "";
    const {m_name,m_pass,m_phone,m_nickname,m_addr1,m_addr2,m_email} = req.body;
    console.log(req.body);
    //빈 문자열이 아니고 undefined가 아닐 때
    if(mytextpass != '' && mytextpass != undefined){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //hash메소드 호출되면 인자로 넣어준 비밀번호를 암호화하여
            //콜백함수 안 hash로 돌려준다.
            bcrypt.hash(mytextpass, salt, function(err, hash) {
                myPass = hash;
                //쿼리작성
                conn.query(`insert into member(m_name, m_pass, m_phone, m_nickname, m_address1, m_address2,m_email) values('${m_name}','${m_pass}','${m_phone}','${m_nickname}','${m_addr1}','${m_addr2}','${m_email}')
                `,(err,result,fields)=>{
                    if(result){
                        res.send("등록되었습니다.")
                    }
                })
            });
        });
    }
    //insert into member(m_name, m_pass, m_phone, m_nickname, m_add1, m_add2,m_email)
    //values(${})
})
//서버를 구동 
app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.");
})    
