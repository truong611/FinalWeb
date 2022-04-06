var express = require('express');
var FacultyModel = require('../models/faculty'); 
var facultyRoute = express.Router();
let {checkAuth,checkAdmin,checkCoordinator,checkFacultyID } = require('../middleware/index')
const { isEmail } = require('../middleware/index');

const facultyController = require('../controller/faculty.controller');

facultyRoute.use(checkAuth);

// tương tác với faculty
facultyRoute.get('/allfaculty', facultyController.allfaculty)
facultyRoute.get('/faculty/:facultyID', facultyController.detail)

facultyRoute.post('/faculty/search', facultyController.search)
facultyRoute.get('/allStudent/:facultyID/',facultyController.allstudent,)
facultyRoute.get('/Coordinator/:facultyID',facultyController.coordinator)

facultyRoute.get('/view:facultyID', checkCoordinator,facultyController.viewmanagine)
facultyRoute.get('/evaluate/:id', checkCoordinator,facultyController.danhgiabaibao)
facultyRoute.get('/allDocument/:email',checkCoordinator ,facultyController.allDocument)

facultyRoute.post('/dodanhgiabaibao:id', checkCoordinator,facultyController.dodanhgiabaibao)

facultyRoute.post('/rate2:id', checkCoordinator,facultyController.rate2)
facultyRoute.get('/evaluate2nd/:id', checkCoordinator,facultyController.danhgiabaibao2nd)

facultyRoute.use(checkAdmin);

//sơn test|


facultyRoute.use('/uploads', express.static('uploads'));
facultyRoute.use('/public', express.static('public'));



facultyRoute.get('/faculty/update/:id',facultyController.update)
facultyRoute.get('/create',facultyController.create)
facultyRoute.get('/faculty/delete/:id',facultyController.delete)


facultyRoute.post('/doupdate:id', facultyController.doupdate)
facultyRoute.post('/doCreate', checkFacultyID,facultyController.docreate)


// tương tác với học sinh
// facultyRoute.get('/faculty/addStudent',facultyController.addStudent)

// facultyRoute.post('/faculty/doAddStudent', isEmail,facultyController.doAddStudent)

module.exports = facultyRoute;