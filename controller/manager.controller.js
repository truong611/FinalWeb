const FacultyModel = require('../models/faculty')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
var fileModel = require('../models/file')
var DashboardtModel = require('../models/Dashboard')
var saltRounds = 10;
class manageController {

    settime(req, res, next) {
        let date = req.body.date;
        let time = req.body.time;        
        let deadline1 = date + " " + time;
        var someDate = new Date(date);
        someDate.setDate(someDate.getDate() + 14);
        var dateFormated = someDate.toISOString().substr(0, 10);
        let deadline2 = dateFormated + " " + time;
        FacultyModel.updateMany({}, { deadline: deadline1, deadline2: deadline2 }, function (err, data) {
            if (err) {
                res.json("")
            }
            FacultyModel.find({}, function (err, data) {
                if (err) {
                    res.json("")
                }
                res.jsonp({success : true})
    })
        })

    }

    //hiển thị tất cả các khoa
    allfaculty(req, res) {
        FacultyModel.find({})
            .then(data => {
                res.render('./marketingmanager/allfaculty', { faculty: data })
            })
            .catch(err => {
                res.json("loi sever")
            })
    }

    //hiển thị tất cả bài viết của khoa đã chọn
    allcontribution(req, res) {
        let facultyID = req.params.facultyID;
        fileModel.find({facultyID:facultyID,status: "Pass"},function(err,result){
            if(err){
                console.log(err) }else{
                    fileModel.find({facultyID:facultyID,status2: "Pass"},function(err,result2){
                        if(err){
                            console.log(err) }else{
                                res.render('marketingmanager/allcontribution', { data: result,data2: result2, facultyID:facultyID })
                            }
                    })          
            }
        })            
    }


// xem thong ke
allstatistical = async (req, res) => {
    AccountModel.find({ facultyID: req.params.facultyID, role: "student" })
        .then(data => {
            DashboardtModel.findOneAndUpdate({ facultyID: req.params.facultyID }, { hocsinhcuakhoa: data.length }, function (err, data) {
                if (err) {
                    res.json("loivl")
                }
            })
            let cout = 0;
            for (var i = 0; i < data.length; i++) {
                fileModel.aggregate(
                    [ 
                        { "$match":  { studentemail: data[i].email, facultyID: req.params.facultyID } }
                    ],  function(err, results) {
                            if(results.length>0){
                                cout = cout +1
                                DashboardtModel.findOneAndUpdate({ facultyID: req.params.facultyID }, { soHocsinhnopbai: cout }, function (err, data) {
                                })
                            }else{
                                DashboardtModel.findOneAndUpdate({ facultyID: req.params.facultyID }, { soHocsinhnopbai: cout }, function (err, data) {
                                })
                            } 
                        }
                )
            }
        })

    fileModel.find({ facultyID: req.params.facultyID }, function (data) { })
        .then(data => {
            let Tongsobaidanop = data.length
            fileModel.count( {facultyID: req.params.facultyID,status: "Pass"}, (err, count) => {
                fileModel.count( {facultyID: req.params.facultyID,status2: "Pass"}, (err, count2) => {
                    let sobaidapass = count + count2
                    DashboardtModel.findOneAndUpdate({ facultyID: req.params.facultyID }, { tongbaidanop: Tongsobaidanop, sobaidapass: sobaidapass }, function (err, data) {
                    })   
                });

            });
        })
        fileModel.find({ facultyID: req.params.facultyID }, function (data) { })
        .then(data => {
            fileModel.count( {facultyID: req.params.facultyID,status: "Fail"}, (err, count) => {
                fileModel.count( {facultyID: req.params.facultyID,status2: "Fail"}, (err, count2) => {
                    let sobaidafail = count + count2
                    DashboardtModel.findOneAndUpdate({ facultyID: req.params.facultyID }, { fail: sobaidafail }, function (err, data) {
                    })   
                });

            });
        }) 

        res.redirect("Statistical" + req.params.facultyID )
    
}
statistical(req, res) {
    DashboardtModel.find({ facultyID: req.params.facultyID }, function (err, data) {
        res.render('marketingmanager/thongke', { data: data })
    })
}
    //đọc bài viết vừa chọn
    readcontribution(req, res) {
        let id = req.params.id
        fileModel.find({ _id: id }, (err, data) => {
            if (err) {
                console.log(err)
            } else if (data.length > 0) {
                res.render('marketingmanager/readcontribution.ejs', { data: data })
            } else {
                res.render('marketingmanager/readcontribution.ejs', { data: data })
            }
        })
    }

    allfacultymanager(req, res) {
        FacultyModel.find({})
            .then(data => {
                res.render('./marketingmanager/allfacultymanager', { faculty: data })
            })
            .catch(err => {
                res.json("loi sever")
            })
    }

    allManager (req,res){
        AccountModel.find({role : "manager"},function(err,data){
            res.render('./marketingmanager/allManager',{account:data})    
    })
    }
    
    updateManager(req,res){
        AccountModel.findById(req.params.id)
            .then(data=>
                res.render('marketingmanager/updateManager',{account:data})
            )
    }
    deleteManager (req,res){
        
            AccountModel.deleteOne({
                _id :  req.params.id
            })
            .then(()=>{
                res.redirect('/manage/allManager/')
            })
        
        
        
    }
    doupdateManager (req,res){
        AccountModel.updateOne({
            _id : req.params.id
        }, req.body)
        .then(()=>{
            res.redirect('/manage/allManager/')
        })
    }
}
module.exports = new manageController;