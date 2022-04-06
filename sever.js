const express = require("express");
const app = express();

var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var path = require('path');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

var fileModel =require('./models/file')
var fileRouter = require('./routes/file.route')
const AccountModel = require('./models/account');

app.set('views','./views');
app.set('view engine','hbs');
app.set('view-engine', 'ejs');
app.use(cookieParser())

app.get('/logout', function (req, res, next) {
    res.clearCookie("token");
    res.clearCookie("id");
    res.clearCookie("facultyID");
    res.clearCookie("email");
    res.clearCookie("deadline");
    res.clearCookie("_cfduid");
    res.redirect('/')
});
var pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));

var AccountRoutes = require('./routes/account.route')
var adminRoute = require('./routes/admin.route')
var facultyRoute = require('./routes/faculty.route')
var indexrouter = require('./routes/index.route')
var studentRoute = require('./routes/student.route')
var coordinatorRoute = require('./routes/coordinator.route')
var guestRoutes = require('./routes/guest.route')
var manageRoutes = require('./routes/manage.route')
var messRoutes = require('./routes/mess.route')

app.get('/error', (req,res)=>{
    res.render('errorhandle.hbs')
})

app.use('/guest', guestRoutes);
app.use('/admin', adminRoute);
app.use('/student', studentRoute);
app.use('/coordinator', coordinatorRoute);
app.use('/account', AccountRoutes);
app.use('/faculty',facultyRoute);
app.use('/',indexrouter);
app.use('/file',fileRouter)
app.use('/manage',manageRoutes)
app.use('/message', messRoutes);

app.get('/download/:id',(req,res)=>{
  fileModel.find({_id:req.params.id},(err,data)=>{
       if(err){
           console.log(err)
       }
       else{
           var x= __dirname+'/public/'+data[0].filePathdoc;
           
           console.log(x)
           res.download(x)
       }
  })
})
app.get('/download2/:id',(req,res)=>{
    fileModel.find({_id:req.params.id},(err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             var x= __dirname+'/public/'+data[0].filePathdoc2;
             
             console.log(x)
             res.download(x)
         }
    })
  })

//tiến hành cài đặt cho chat box
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);


//real-time in chat
io.on("connection", (socket) => {
    socket.on("new_user_message", (data) => {
        socket.join(`${data.cookiesemail}and${data.user}`);
        socket.join(`${data.user}and${data.cookiesemail}`);
        var query1 = {
            userSend: data.cookiesemail,
            userReceive: data.user,
        }
        var query2 = {
            userSend: data.user,
            userReceive: data.cookiesemail,
        }
  
        // event listen client send text
        socket.on("client_send_mes", data => {
                socket.to(`${data.cookiesemail}and${data.User}`).to(`${data.User}and${data.cookiesemail}`).emit("server_send_mes", {
                    message: data.mes,
                    from: data.cookiesemail,
                    Time_Mes: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
  
                });
  
            MongoClient.connect('mongodb+srv://minhpham852000:Quangminh2000@cluster0.46ara.mongodb.net/test', (err, db) => {
                let dbo = db.db("test");
                dbo.collection("chats").updateOne(query1, {
                    "$push": {
                        message: {
                            check: 1,
                            Mes: `${data.mes}`,
                            index_time:new Date().valueOf(),
                            date: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
  
                        }
                    }
                });
                dbo.collection("chats").updateOne(query2, {
                    "$push": {
                        message: {
                            check: 0,
                            Mes: `${data.mes}`,
                            index_time:new Date().valueOf(),
                            date: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                            
                        }
                    }
                });
            });
        }); 
        socket.on("client_send_file_mes", (data) => { 
            socket.to(`${data.cookiesemail}and${data.User}`).to(`${data.User}and${data.cookiesemail}`).emit("server_send_file_mes", {
                message: data.mes,
                from: data.cookiesemail,
  
            });
        });
    });
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


