var express = require('express');
var FacultyModel = require('../models/faculty'); 
var coordinatorRoute = express.Router();
let {checkAuth,checkAdmin } = require('../middleware/index')
const { isEmail } = require('../middleware/index');

const coordinatorController = require('../controller/coordinator.controller');
coordinatorRoute.use(checkAuth);

coordinatorRoute.get('/update:id',coordinatorController.update)
coordinatorRoute.get('/delete:id',coordinatorController.deleteCoordinator)


coordinatorRoute.post('/doupdate:id', coordinatorController.doupdate)

module.exports = coordinatorRoute