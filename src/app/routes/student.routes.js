module.exports = app => {
    const students = require("../controllers/student.controller.js");
    let router = require("express").Router();

    router.post("/students/", students.create);
    router.get("/students/", students.findAll);
    router.get("/students/:id", students.findOne);
    router.put("/students/:id", students.update);
    router.put("/students/enroll/:id", students.addStudentToCourse);
    router.delete("/students/", students.deleteAll);
    router.delete("/students/:id", students.delete);

    app.use('/api', router);
};