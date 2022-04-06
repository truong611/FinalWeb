var express = require("express");
var FacultyModel = require("../models/faculty");
var studentRoute = express.Router();
let { checkAuth, checkAdmin } = require("../middleware/index");
const { isEmail } = require("../middleware/index");
const defaultController = require("../controller/default.controller");
const studentController = require("../controller/student.controller");
studentRoute.use(checkAuth);

studentRoute.get("/update:id", studentController.update);
studentRoute.get("/delete:id", studentController.deleteStudent);
studentRoute.get("/category", defaultController.getCategories);
studentRoute.post("/category/create", defaultController.createCategories);
studentRoute
  .post("/category/edit/:id", defaultController.submitEditCategoriesPage)
  .get(defaultController.getEditCategoriesPage);

/* ADMIN COMMENT ROUTES */
studentRoute.get("/comment", defaultController.getComments);


studentRoute.post("/doupdate:id", studentController.doupdate);

module.exports = studentRoute;
