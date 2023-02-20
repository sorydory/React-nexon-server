const express= require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//서버 생성
const app =  express(); 
//프로세서의 주소 포트번호 지정 
const port = 8090;
//브라우저의 cors이슈를 막기 위해 설정 
app.use(cors());
//josn 형식의 데이터를 처리하도록 설정
app.use(express.json());

//upload 폴더 클라이언트에 접근 가능하도록 설정
app.use("/upload",express.static("upload"));
//storage 생성 / diskStorage 파일을 저장할때의 모든 기능제어기능을 제공
const storage = multer.diskStorage({
    destination: (req, file, cd)=>{
        cd(null, 'upload/news');
    },
    filename: (req, file, cd)=>{
        const newFilename = file.originalname;
        cd(null, newFilename)
    },
})
//upload 객체 생성하기
const upload = multer({storage:storage});
//upload 경로로 post 요청시 응답 구하기
app.post("/upload", upload.single('img'),(req,res)=>{
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
    database: "nexon" 
})
//선연결하기
conn.connect();

//회원가입 요청 
app.post("/join", async(req,res)=>{
    //입력받은 비밀번호 mytextpass로 할당
    const mytextpass = req.body.m_pass;
    let myPass = "";
    const { m_id, m_name, m_pass,m_passch,m_email,m_phone,m_address1,m_address2} = req.body;
    console.log(req.body);
    //빈문자열이 아니고 undefined가 아닐때
    if(mytextpass != '' && mytextpass != undefined){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //hash 함수를 호출되면 인자로 넣어준 비밀번호를 암호화하여 
            //콜백함수 안 hash로 돌려준다.
            bcrypt.hash(mytextpass, salt, function(err, hash) {
                myPass = hash;
                //쿼리작성
                conn.query(`insert into member(m_id,m_name, m_pass,m_passch,m_email,m_phone,m_address1,m_address2)
                values('${m_id}','${m_name}','${m_pass}','${m_passch}','${m_email}',
                '${m_phone}','${m_address1}','${m_address2}'')
                `,(err, result, fields)=>{
                if(result){
                    res.send("등록되었습니다.");
                    }
                })
            });
        });
    }
    //insert into member(m_id, m_name, m_pass, m_passch, m_phone, m_email, m_address1, m_address2)
    //values(${})
})

//로그인요청 
app.post("/login",async (req,res)=> {
    // 1)useremail에 일치하는 데이터가 있는지 확인
    // 2)userpass 암호화를 해서 쿼리 결과의 패스워드랑 일치하는 체크
   const {m_id,m_pass} = req.body;
   
   conn.query(`select * from member where m_id = '${m_id}'`,
   (err,result,fields)=>{
    //결과가 undefind가 아니고 결과의 0번째가 undefind가 아닐때
    //결과가 있을때
    console.log(result);
        if(result != undefined && result[0] != undefined){
            //compare => userpass,result[0].m_pass 비교해서 뒤에 함수호출 
            bcrypt.compare(m_pass, result[0].m_pass, function(err,rese){
                //result==true
                if(rese){
                    console.log("로그인 성공 우헤헤");
                    res.send(result);
                }else{
                    console.log(err);
                    res.send("실패");
                }
            })
        }else{
            console.log("데이터가 없습니다.");
        }
   })
})

//아이디 찾기 요청       (요청, 응답)
app.post("/findid", async(req,res)=>{
    const{m_name,m_phone,m_email1} = req.body;
    //퀴리문 ,실행했을때 결과를 불러오는 콜백함수
    conn.query(`select * from member where m_name = '${m_name}' and m_phone='${m_phone}' and m_email='${m_email}'`,(err,result,fields)=>{
        if(result) {
            console.log(result[0].m_id);
            res.send(result[0].m_id);
        }
     });
})

//비밀번호찾기 요청       (요청, 응답)
app.post("/findpass", async(req,res)=>{
    const{m_id,m_phone} = req.body;
    //퀴리문 ,실행했을때 결과를 불러오는 콜백함수 
    conn.query(`select * from member where m_id = '${m_id}' and m_phone='${m_phone}'`,(err,result,fields)=>{
        if(result) {
            res.send(result[0].m_id);
            console.log(result[0].m_id);
        }
        console.log(err);
     });
})


//패스워드 변경 요청
app.patch("/updatePw", async (req,res)=>{
    const {m_pass, m_id} = req.body;
    //update 테이블 이름
    //set 필드이름=데이블값
    //where 조건절 update member set m_pass 
    const mytextpass = m_password;
    let myPass = "";
    if(mytextpass != '' && mytextpass != undefined){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //hash 함수를 호출되면 인자로 넣어준 비밀번호를 암호화하여
            //콜백함수 안 hash로 돌려준다.
            bcrypt.hash(mytextpass, salt, function(err, hash) {
                myPass = hash;
                //쿼리작성
                conn.query(`update member set m_pass ='${myPass}', m_passch='${myPass}' where m_id='${m_id}'
                `,(err, result, fields)=>{
                if(result){
                    res.send("등록되었습니다.");
                    console.log(result);
                    }
                console.log(err);
                })
            });
        });
    }
 })

//뉴스 등록 요청 
app.post('/news',async (req,res)=>{
    const {n_title,n_date,n_titledesc,n_desc,n_image} = req.body;
    conn.query(`insert into news (n_title,n_date,n_titledesc,n_desc,n_image) values(?,?,?,?)`,
        [n_title,n_date,n_titledesc,n_desc,n_image],
        (err,result,fileds)=>{
            if(result){
                res.send("ok")
            }else{
                console.log(err);
            }
    })
})

// //음식 데이터 불러오기
// app.get("/AW/bread",async (req,res) => {
//     conn.query(`select * from food where f_category='브레드' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/cake",async (req,res) => {
//     conn.query(`select * from food where f_category='케이크' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/sandwich",async (req,res) => {
//     conn.query(`select * from food where f_category='샌드위치 & 샐러드' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/food",async (req,res) => {
//     conn.query(`select * from food where f_category='따뜻한 푸드' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/fruit",async (req,res) => {
//     conn.query(`select * from food where f_category='과일 & 요거트' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/snack",async (req,res) => {
//     conn.query(`select * from food where f_category='스낵 & 미니 디저트' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })
// app.get("/AW/icecream",async (req,res) => {
//     conn.query(`select * from food where f_category='아이스크림' `,(err,result,fields)=>{
//         res.send(result)
//     })
// })

//서버를 구동 
app.listen(port,()=>{
    console.log("서버가 동작하고 있습니다.");
})


