const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')
const FileModel = require('../models/file')

const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');
var saltRounds = 10;
var cookie = require('cookie');


let update =(req,res)=>{
    // AccountModel.findById(req.params.id)
    //     .then(data=>
    //         res.render('student/updatestudent',{account:data})
    //     )
   AccountModel.findById(req.params.id)
    .then((data)=>
        FacultyModel.find(function(err,data){
        }).then(data1=>{
        res.render('student/updatestudent',{account:data,faculty:data1})

        })
    )
}
let deleteStudent = (req,res)=>{
    AccountModel.findById({_id:req.params.id},function(err,data){
        let facultyID = data.facultyID
        let email = data.email
        AccountModel.deleteOne({
            _id :  req.params.id
        })
        .then(()=>{
            FileModel.deleteMany({studentemail: email},function(){
                res.redirect('/faculty/allStudent/'+ facultyID)

            })
        })
    })
    
    
}
let doupdate =(req,res)=>{
    AccountModel.updateOne({
        _id : req.params.id
    }, req.body)
    .then(()=>{
        res.redirect('/faculty/allStudent/'+ req.body.facultyID)
    })
}


module.exports ={
    doupdate,
    deleteStudent,
    update,
    
}