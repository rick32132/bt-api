module.exports = app => {
    const courses = require("../controllers/course.controller.js");
    let router = require("express").Router();

    router.post("/", courses.create);
    router.get("/", courses.findAll);
    router.get("/withStudents", courses.findStudentsOfEachCourse);
    router.get("/:id", courses.findOne);
    router.put("/:id", courses.update);
    router.put("/enroll/:id", courses.addCourseToStudent);
    router.delete("/", courses.deleteAll);
    router.delete("/:id", courses.delete);

    app.use('/api/courses', router);
};