var express = require('express');
var FacultyModel = require('../models/faculty'); 
var adminRoute = express.Router();

const {checkAuth, isEmail , checkAdmin} = require('../middleware/index');
const AdminController = require('../controller/admin.controller');
var bodyParser = require('body-parser');
adminRoute.use(bodyParser.urlencoded({extended: false}));

adminRoute.use(checkAuth);
adminRoute.use(checkAdmin);

//tạo tk

adminRoute.get('/createAccount', AdminController.createAccount)
adminRoute.post('/docreateAccount', isEmail,AdminController.docreateAccount)

//Thêm học sinh vào lớp
adminRoute.get('/addtoFaculty', AdminController.addtoFaculty)
adminRoute.post('/doaddtoFaculty:id', AdminController.doaddtoFaculty)

module.exports = adminRoute;