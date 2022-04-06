const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');
var saltRounds = 10;

let update =(req,res)=>{
    AccountModel.findById(req.params.id)
    .then((data)=>
        FacultyModel.find(function(err,data){
        }).then(data1=>{
        res.render('coordinator/updateCoordinator',{account:data,faculty:data1})

        })
    )
}
let deleteCoordinator = (req,res)=>{
    AccountModel.findById({_id:req.params.id},function(err,data){
        let facultyID = data.facultyID
        AccountModel.deleteOne({
            _id :  req.params.id
        })
        .then(()=>{
            res.redirect('/faculty/Coordinator/'+ facultyID)
        })
    })
    
    
}
let doupdate =(req,res)=>{
    
    AccountModel.updateOne({
        _id : req.params.id
    }, req.body)
    .then(()=>{
        res.redirect('/faculty/Coordinator/'+ req.body.facultyID)
    })
}

module.exports ={
    doupdate,
    deleteCoordinator,
    update

}