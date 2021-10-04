const db = require("../models");
const Student = db.students;
const Course = db.courses;

exports.create = (req, res) => {
    if(!req.body.name) {
        res.status(422).send({ message: "Name can not be empty!" });
        return;
    }

    const student = new Student({
        name: req.body.name,
        age: req.body.age,
    });

    student
        .save(student)
        .then(async data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while creating the Student."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: {$regex: new RegExp(name), $options: "i"}} : {};

    Student.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ocurred while retrieving students."
            });
        })

};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Student.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Student with id " + id});
            else res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `Error retrieving Student with id ${id}`
        });
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Student.findByIdAndUpdate(id, {name: req.body.name, age: req.body.age}, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Student with id=${id}. Maybe Student was not found!`
                })
            } else res.send({ message: "Student was updated succesfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating Student with id ${id}`
            });
        });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Student.findByIdAndRemove(id)
    .then(async data => {
        if(!data) {
            res.status(404).send({
                message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
            });
        } else {
            await Course.updateMany({ '_id': data.courses }, { $pull: { students: data.id } });
            res.send({
                message: "Student was deleted successfully!"
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Could not delete Student with id=${id}`
        });
    });
};

exports.deleteAll = (req, res) => {
    Student.deleteMany({})
     .then(async data => {
         await Course.updateMany({}, { students: [] });
         res.send({
             message: `${data.deletedCount} Students were deleted successfully!`
         });
     })
     .catch(err => {
         res.status(500).send({
             message: err.message || "Some error ocurred while removing all students."
         });
     });
};

exports.addStudentToCourse = (req, res) => {
    if (!req.body.courseId) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    Course.findById(req.body.courseId)
        .then(data => {
            if(!data.available){
                res.send({ message: "This course is not available!"})
            }
            else{
                Student.findById(id)
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update Student with id=${id}. Maybe Student was not found!`
                        })
                    }else{
                        if(!data.courses.includes(req.body.courseId)){
                            Student.findByIdAndUpdate(id, { $push: { courses: req.body.courseId } }, { useFindAndModify: false })
                            .then(data => {
                                    Course.findByIdAndUpdate(req.body.courseId, { $push: { students: id } }, { useFindAndModify: false })
                                    .then(data => {
                                        res.send({ message: "Student was sucessfully enrolled." });
                                    })
                            })
                        }else{
                            res.send({ message: "Student is already enrolled."})
                        }
                    } 
                });
            } 
        });   
};