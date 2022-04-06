const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')


const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');
var DashboardtModel = require('../models/Dashboard')
var fileModel = require('../models/file');
const { findById } = require('../models/faculty');

class FacultyController {
    
    create(req,res){
        res.render('./faculty/create')
    }

    detail(req,res){
        let facultyID = req.params.facultyID;

        FacultyModel.find({
            facultyID : facultyID
        })
        .then(data=>{
            console.log(data)
            res.render('./faculty/detail',{faculty:data})
        })
        
    }

    allfaculty(req,res ){
        FacultyModel.find({

        })
        .then(data=>{
            res.render('./faculty/faculty',{faculty: data})
        })
        .catch(err=>{
            res.json("loi sever")
        })
    }

    search(req,res){
        var facultyname = req.body.facultyname;
        var topic = req.body.topic;
        FacultyModel.find({
            facultyname : facultyname,   
        })
        .then(data=>{
            res.render('./faculty/faculty',{faculty:data})
        })
    }

    create(req,res,next){
        res.render('./faculty/create')
    }

    update(req,res){
        FacultyModel.findById(req.params.id)
        .then(data=>
            res.render('./faculty/update',{faculty:data})
        )
    }

    docreate(req,res){
        var facultynme = req.body.facultyname

        var newFaculty = FacultyModel({
            facultyname : facultynme,
            topic : req.body.topic,
            facultyID: req.body.facultyID,

            student: []
        })
    
        newFaculty.save(function(err){
            if(err){
                console.log(err)
            }else{
                var newDashboard = DashboardtModel({
                    facultyID:req.body.facultyID
                })
                newDashboard.save(function(err){
                    res.redirect('/faculty/allfaculty')
                })
                // res.redirect('/faculty/allfaculty')
            }
        })
    }

    doupdate(req,res){
        // var id1 = req.params.id
        FacultyModel.updateOne({
            _id : req.params.id
        }, req.body)
        .then(()=>{
            res.redirect('/faculty/allfaculty')
        })
    }

    delete(req,res){
        var faculty= req.params.id
        faculty = faculty.split('.')
        var facultyID = faculty[1]
        var id = faculty[0]
        


        AccountModel.updateMany({facultyID:facultyID, role:"student"},{facultyID:"None"},function(err,result){
            AccountModel.updateMany({facultyID:facultyID, role:"coordinator"},{facultyID:"None"},function(err,result1){
                DashboardtModel.deleteOne({
                    facultyID : facultyID
                }).then(()=>{
                    FacultyModel.deleteOne({
                        _id : id
                    })
                    .then(()=>{
                        res.redirect('/faculty/allfaculty')
                    })
                })
            })  
        })
        
    }

    addStudent(req,res){
    //     FacultyModel.find(function(err,data){
    //         res.render('./student/faculty_student',{faculty:data})    
    // })
    res.render('./student/faculty_student',{faculty:data})    
    }

    doAddStudent(req,res){
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;
            let facultyID = req.body.facultyID;
            
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            let newStudent = AccountModel({
                username,
                password :hash,
                email,
                facultyID  
            })
            newStudent.save(function(err,data){
            if(err){
                console.log(err)
            }else{
                res.render('./student/faculty_student')
            }
            })
    }

    allstudent(req,res){
            // FacultyModel.find({facultyname:req.params.facultyID})
            AccountModel.find({
                facultyID: req.params.facultyID,
                'role' :'student'
            })
            .then(data=>{
            res.render('./student/allstudent', {account:data})
            })  
        

    }

    coordinator(req,res){ 
        AccountModel.find({
            facultyID: req.params.facultyID,
            role :'coordinator'
        })
        .then(data=>{
        res.render('./coordinator/coordinator_profile', {coordinator:data})
    })  
}

           
    //sơn test|
    viewmanagine(req,res){
        let facultyID = req.params.facultyID
        AccountModel.find({facultyID:facultyID,role:"student"},(err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('./faculty/baocuahocsinh',{account:data})
        }
        else{
            res.render('./faculty/baocuahocsinh',{account:data})
        }
        })
    }

    allDocument(req,res){
        fileModel.find({
            studentemail : req.params.email
        }).then(data=>{
            res.render('./file/allDocument.ejs',{file : data})
        })
    }
        
    danhgiabaibao(req,res){
        let id = req.params.id
        fileModel.find({_id:id},(err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('faculty/danhgia.ejs',{data:data})
        }
        else{
            res.render('faculty/danhgia.ejs',{data:data})
        }
        })
    }

    dodanhgiabaibao(req,res){
        let id = req.params.id
        let status = req.body.status
        let comment = req.body.comment
        fileModel.findById({_id :id},function(err,data){
            let studentemail = data.studentemail
            console.log(studentemail)
        fileModel.updateOne(
            { _id: id },   // Query parameter
            {                     // Replacement document
                status: status,
                comment: comment
            })
            .then(()=>{
                res.redirect('/faculty/allDocument/' + studentemail)
            })
        })
    }

    danhgiabaibao2nd(req,res){
        let id = req.params.id
        fileModel.find({_id:id},(err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('faculty/danhgia2nd.ejs',{data:data})
        }
        else{
            res.render('faculty/danhgia2nd.ejs',{data:data})
        }
        })
    }


    rate2(req,res){
        let id = req.params.id
        let status2 = req.body.status
        let comment2 = req.body.comment
        fileModel.findById({_id :id},function(err,data){
            let studentemail = data.studentemail            
        fileModel.updateOne(
            { _id: id },   // Query parameter
            {                     // Replacement document
                status2: status2,
                comment2: comment2
            })
            .then(()=>{
                res.redirect('/faculty/allDocument/' + studentemail)
            })
        })
    }
}
module.exports = new FacultyController;