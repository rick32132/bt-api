module.exports = app => {
    const students = require("../controllers/student.controller.js");
    let router = require("express").Router();

    router.post("/", students.create);
    router.get("/", students.findAll);
    router.get("/:id", students.findOne);
    router.put("/:id", students.update);
    router.put("/enroll/:id", students.addStudentToCourse);
    router.delete("/", students.deleteAll);
    router.delete("/:id", students.delete);

    app.use('/api/students', router);
};