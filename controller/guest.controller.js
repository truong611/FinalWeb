const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');
var saltRounds = 10;
var fileModel = require('../models/file')

class guestController {
    
    //last piece
    allcontribution(req,res){
        let facultyID = req.params.facultyID;
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


    readcontribution(req,res){
                let id = req.params.id
                fileModel.find({_id:id},(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                    else if(data.length>0){
                        res.render('guest/danhgia.ejs',{data:data})
                    }
                    else{
                        res.render('guest/danhgia.ejs',{data:data})
                    }
                })
    }

    allGuest (req,res){
        AccountModel.find({role : "guest"},function(err,data){
            res.render('./guest/allGuest',{account:data})    
    })
    }
    
    
    updateGuest(req,res){
        AccountModel.findById(req.params.id)
            .then(data=>
                res.render('guest/updateGuest',{account:data})
            )
    }
    deleteGuest (req,res){
        
            AccountModel.deleteOne({
                _id :  req.params.id
            })
            .then(()=>{
                res.redirect('/guest/allGuest/')
            })
        
        
        
    }
    doupdateGuest (req,res){
        AccountModel.updateOne({
            _id : req.params.id
        }, req.body)
        .then(()=>{
            res.redirect('/guest/allGuest/')
        })
    }
}
module.exports = new guestController;