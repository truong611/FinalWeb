// let { checkEmail} = require('../service/auth')
// let accountmodel = require('../models/account');
let AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');
const FacultyModel = require('../models/faculty');
// let checkEmail = (email)=>{
//     return AccountModel.findOne({email:email})

// }
let isEmail = async (req,res,next)=>{
    try {
        // let user = await checkEmail(req.body.email) 
        let user = req.body.email;
        await AccountModel.findOne({
            email:user
        }).then(user=>{
            if(!user){
                next();
            }else{
                return res.status(400).json({
                    message : "Email already exists",
                    status: 400,
                    error : true,
                })
            }
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "loi sever",
            status: 500,
            error : true
        })

    }
}
let checkFacultyID = async (req,res,next)=>{
    try {
        // let user = await checkEmail(req.body.email) 
        let facultyID = req.body.facultyID;
        await FacultyModel.findOne({
            facultyID:facultyID
        }).then(facultyID=>{
            if(!facultyID){
                next();
            }else{
                return res.status(400).json({
                    message : "Faculty already exists",
                    status: 400,
                    error : true,
                })
            }
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "loi sever",
            status: 500,
            error : true
        })

    }
}

let checkLogin = async (req,res,next)=>{
    try {
        let user = req.body.email;
        await AccountModel.findOne({
            email:user
        })
        // let user = await checkEmail(req.body.email)
        .then(user=>{
            if(!user){
                var message= "Username or password is invalid"
                res.render("login",{message:message
                }) 

            }else{
                req.user = user

                next();
            }
        }) 
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "loi sever",
            status: 500,
            error : true
        })
    }
}

let getUserById = function getUserById(id){
    return AccountModel.findOne({_id:id})
}
let checkAuth = async (req,res,next)=>{
    try {
        var token = req.cookies.token || req.body.token
        let decodeAccount = jwt.verify(token,'minh')
        let user = await getUserById(decodeAccount._id)
        if(user){
            req.userLocal = user;
            next();
        }else{
            return res.status(400).json({
                message : "tk k ton tai",
                status: 400,
                error : true,
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "hay dang nhap",
            status: 500,
            error : true
        },
        res.redirect('/'))
    }
}

let checkAdmin = (req,res,next)=>{
    if (req.userLocal.role === "admin"){
        next()
    }else{
        return res.status(400).json({
            message : "no permission",
            status: 400,
            error : true,
        })
    }
}
let checkCoordinator = (req,res,next)=>{
    if (req.userLocal.role === "coordinator"){
        next()
    }else{
        return res.status(400).json({
            message : "no permission",
            status: 400,
            error : true,
        })
    }
}
let checkStudent = (req,res,next)=>{
    if (req.userLocal.role === "student"){
        next()
    }else{
        return res.status(400).json({
            message : "no permission",
            status: 400,
            error : true,
        })
    }
}
module.exports ={
    isEmail,
    checkLogin,
    checkAdmin,
    checkAuth,
    getUserById,
    checkCoordinator,
    checkStudent,
    checkFacultyID
}