var express = require('express');
var FacultyModel = require('../models/faculty'); 
var manageRoute = express.Router();
let {checkAuth,checkAdmin } = require('../middleware/index')
// const { isEmail } = require('../middleware/index');
const manageController = require('../controller/manager.controller');
const { isEmail } = require('../middleware/index');

manageRoute.use('/uploads', express.static('uploads'));
manageRoute.use('/public', express.static('public'));
manageRoute.use(checkAuth);

//cài đặt dealine nộp bài
manageRoute.post('/settime', manageController.settime)

//xem bài báo
manageRoute.get('/allfaculty', manageController.allfaculty)
manageRoute.get('/allcontribution:facultyID', manageController.allcontribution)
manageRoute.get('/viewStatistical:facultyID', manageController.allstatistical)
manageRoute.get('/Statistical:facultyID', manageController.statistical)


manageRoute.get('/readcontribution:id', manageController.readcontribution)

//downloadfilezip
manageRoute.get('/allfacultymanager', manageController.allfacultymanager)
// CRUD
manageRoute.get('/allManager',manageController.allManager)

manageRoute.get('/update:id',manageController.updateManager)
manageRoute.get('/delete:id',manageController.deleteManager)
manageRoute.post('/doupdate:id', manageController.doupdateManager)

module.exports = manageRoute    