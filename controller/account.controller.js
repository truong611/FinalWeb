// let {signUp} = require('../service/auth')
const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const FacultyModel = require('../models/faculty')
const fileModel = require('../models/file')

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
// const { model } = require('../models/account');
let indexAdmin = (req,res)=>{
    let email = req.cookies.email
    AccountModel.findOne({email : email})
    .then(data=>{
        console.log(data)
        res.render('./home/homeAdmin',{account:data})
    })
}

let indexCoordinator = (req,res)=>{
    let email = req.cookies.email
    let facultyID = req.cookies.facultyID

    AccountModel.findOne({email : email})
    .then(data=>{
        FacultyModel.findOne({facultyID: facultyID},function(err, result){
            res.render('./home/homeCoordinator',{account:data,faculty :result})
        })    
    })
}

let indexStudent = (req,res)=>{
    let email = req.cookies.email
    let facultyID = req.cookies.facultyID

    AccountModel.findOne({email : email})
    .then(data=>{
        FacultyModel.findOne({facultyID: facultyID},function(err, result){
            var deadline = result.deadline
            res.render('./home/homeStudent',{account:data,deadline:deadline,faculty :result})
        })    
    })
}

let indexGuest = (req,res)=>{
    let facultyID = req.cookies.facultyID;
        fileModel.find({facultyID:facultyID,status: "Pass"},function(err,result){
            if(err){
                console.log(err) }else{
                    fileModel.find({facultyID:facultyID,status2: "Pass"},function(err,result2){
                        if(err){
                            console.log(err) }else{
                            res.render('guest/baocuahocsinh',{data:result,data2:result2})
                        }
                    })          
            }
        }) 
}

let indexManager = (req,res)=>{
    let email = req.cookies.email
    AccountModel.findOne({email : email})
    .then(data=>{
        res.render('./home/homeMarketingManager',{account:data})

    })
}

let signUpController = async(req,res)=>{
    try {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        if(username && password){
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            AccountModel.create({
                username,
                password :hash,
                email
            });
        } 
        let token = jwt.sign({_id: req.body._id},'minh');
        res.cookie("token",token,{maxAge: 60*60*10000});
        return res.status(200).json({
            message : "Sign Up success",
            error : false
        })
    }catch(error) {
        if(error){
            res.status(400).json({
                message : "Sign Up fail",
                error: true
            })
        }
    }
}

let loginController = function(req,res){
    bcrypt.compare(req.body.password, req.user.password, function(err,result){
        if(err){
            return res.status(500).json({
                message : "loi sever",
                status: 500,
                error : true
            })
        }
        if(result){
            let token = jwt.sign({_id : req.user._id},'minh',{expiresIn :'1d'})
            res.cookie("token",token,{maxAge: 24*60*60*10000});
            let user = req.user 
            res.cookie('email',user.email, { maxAge: 90000000, httpOnly: true });
            res.cookie('id',user._id, { maxAge: 90000000, httpOnly: true });
            res.cookie('facultyID',user.facultyID, { maxAge: 90000000, httpOnly: true });
            if(user.role === "admin"){
                res.redirect("./indexAdmin")
            }
            if(user.role === "student"){          
                res.redirect("./indexStudent")
            }
            if(user.role === "coordinator"){
                res.redirect("./indexCoordinator")
            }
            if(user.role === "guest"){
                res.redirect("./indexGuest")  
            }    
            if(user.role === "manager"){
                res.redirect("./indexManager")
            }                         
            }else{
                var message= "Username or password is invalid"
                res.render("login",{message:message})
            }
        }
    )
}

module.exports ={
    signUpController,
    loginController,
    indexAdmin,
    indexCoordinator,
    indexStudent,
    indexManager,
    indexGuest
}