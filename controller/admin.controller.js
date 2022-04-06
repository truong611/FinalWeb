const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');
var DashboardtModel = require('../models/Dashboard')
var fileModel = require('../models/file');
const { findById } = require('../models/faculty');
var bcrypt = require('bcrypt');
const { response } = require('express');
var saltRounds = 10;
class AdminController {
    createAccount(req,res ){
        FacultyModel.find({},function(data){

        }).then(data=>{
             res.render("admin/createAccount", {faculty:data})

        })
    }

    docreateAccount(req,res ){
        var password = req.body.password
        var role = req.body.Role
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        let facultyID = req.body.facultyID

        let newAccount = AccountModel({
            username: req.body.username,
            password :hash,
            email: req.body.email,
            facultyID: facultyID,
            role : role,
            phone:req.body.phone,
            birthday:req.body.birthday,
            address:req.body.address
        })
        newAccount.save(function(err,data){
            if(err){
                console.log(err)
            }else{
                FacultyModel.find({},function(data){})
                .then(data=>{
                    if(role == "coordinator" && facultyID !="None"){
                        res.redirect("/faculty/Coordinator/" + req.body.facultyID)  
                    }else if(role == "coordinator" && facultyID ==="None"){
                        res.redirect('/admin/addtoFaculty')              
                    }else if(role == "student" && facultyID !="None"){
                        res.redirect("/faculty/allStudent/" + req.body.facultyID)
                    }else if(role == "student" && facultyID !="None"){
                        res.redirect('/admin/addtoFaculty')     

                    }else if (role == "guest" && facultyID === "None"){
                    //    var message= role + " cannot add classes"
                    //    AccountModel.deleteOne({_id: newAccount._id})
                    //    .then(()=>{
                    //     res.render("admin/createAccount", {faculty:data,message: message}) 
                    //    })
                    res.redirect('/admin/addtoFaculty')     


                    }else if (role == "guest" && facultyID != "None" ){
                        res.redirect("/guest/allGuest")  

                    }else if(role == "manager" && facultyID === "None"){
                        res.redirect("/manage/allManager")
                    }else if (role == "manager" && facultyID != "None"){
                        var message= role + " cannot add classes"
                        AccountModel.deleteOne({_id: newAccount._id})
                        .then(()=>{
                         res.render("admin/createAccount", {faculty:data,message: message}) 
                        })           
                    }
                })
            }
        })
    }
    

    addtoFaculty(req,res ){
        AccountModel.find({facultyID:"None",role:"student"},function(err,result){
            AccountModel.find({facultyID:"None",role:"coordinator"},function(err,result2){
                AccountModel.find({facultyID:"None",role:"guest"},function(err,result4){
                    console.log(result4)
                    FacultyModel.find({},function(err,result3){
                        res.render("admin/addtoFaculty.ejs",{data:result,data2:result2,faculty: result3,data3 : result4})
                    })
                })
            })
        })
    }
    doaddtoFaculty(req,res ){
        AccountModel.findOneAndUpdate({_id: req.params.id},{facultyID: req.body.facultyID},function(err,result){
            // res.send('<script>alert("Successfully added");window.back();</script>')
            res.redirect('/admin/addtoFaculty')
        })
    }
}
module.exports = new AdminController;