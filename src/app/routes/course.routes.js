module.exports = app => {
    const courses = require("../controllers/course.controller.js");
    let router = require("express").Router();

    router.post("/courses/", courses.create);
    router.get("/courses/", courses.findAll);
    router.get("/courses/withStudents", courses.findStudentsOfEachCourse);
    router.get("/courses/:id", courses.findOne);
    router.put("/courses/:id", courses.update);
    router.put("/courses/enroll/:id", courses.addCourseToStudent);
    router.delete("/courses/", courses.deleteAll);
    router.delete("/courses/:id", courses.delete);

    app.use('/api', router);
};