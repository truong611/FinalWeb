var express = require('express');
var FacultyModel = require('../models/faculty'); 
var guestRoute = express.Router();
let {checkAuth,checkAdmin } = require('../middleware/index')
const { isEmail } = require('../middleware/index');
const guestController = require('../controller/guest.controller');

guestRoute.use('/uploads', express.static('uploads'));
guestRoute.use('/public', express.static('public'));
guestRoute.use(checkAuth);

//hiển thị các khoa 
guestRoute.get('/danhsachsvien:facultyID', guestController.allcontribution)
//xem các bài đăng từ các khoa 
guestRoute.get('/danhgiabaibao:id', guestController.readcontribution)
//crud

guestRoute.get('/allGuest',guestController.allGuest)

guestRoute.get('/update:id',guestController.updateGuest)
guestRoute.get('/delete:id',guestController.deleteGuest)
guestRoute.post('/doupdate:id', guestController.doupdateGuest)

module.exports = guestRoute