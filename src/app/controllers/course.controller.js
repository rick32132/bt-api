const db = require("../models");
const Course = db.courses;
const Student = db.students;

exports.create = (req, res) => {
    if(!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        available: req.body.available ? req.body.available : false,
    });
    console.log(course);

    course
        .save(course)
        .then(async data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while creating the Course."
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    let condition = title ? { title: {$regex: new RegExp(title), $options: "i"}} : {};

    Course.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while retrieving courses."
            });
        })

};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Course with id " + id});
            else res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error retrieving Course with id ${id}`
        });
    });
};

exports.findStudentsOfEachCourse = (req, res) => {
    Course.find({}, "title -_id").populate("students", "name -_id")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while retrieving courses."
            });
        })
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Course.findByIdAndUpdate(id, {title: req.body.title, description: req.body.description, available: req.body.available},
        { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Course with id=${id}. Maybe Course was not found!`
                })
            } else res.send({ message: "Course was updated succesfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating Course with id ${id}`
            });
        });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Course.findByIdAndRemove(id)
    .then(async data => {
        if(!data) {
            res.status(404).send({
                message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
            });
        } else {
            await Student.updateMany({ '_id': data.students }, { $pull: { courses: data.id } });
            res.send({
                message: "Course was deleted successfully!"
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Could not delete Course with id=${id}`
        });
    });
};

exports.deleteAll = (req, res) => {
    Course.deleteMany({})
     .then(async  data => {
        await Student.updateMany({}, { courses: [] });
        res.send({
            message: `${data.deletedCount} Courses were deleted successfully!`
        });
     })
     .catch(err => {
         res.status(500).send({
             message: err.message || "Some error ocurred while removing all courses."
         });
     });
};

exports.addCourseToStudent = (req, res) => {
    if (!req.body.studentId) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Course.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Course with id=${id}. Maybe Course was not found!`
                })
            }else{
                if(!data.available) {
                    res.send({ message: "This course is not available!"})
                }
                else{
                    if(!data.students.includes(req.body.studentId)){
                        Course.findByIdAndUpdate(id, { $push: { students: req.body.studentId } }, { useFindAndModify: false })
                        .then(data => {
                                Student.findByIdAndUpdate(req.body.studentId, { $push: { courses: id } }, { useFindAndModify: false })
                                .then(data => {
                                    res.send({ message: "Enrollment was sucessfully added to student." });
                                })
                        })
                    }else{
                        res.send({ message: "Enrollment is already added to Student."})
                    }
                }
            } 
    })
};




