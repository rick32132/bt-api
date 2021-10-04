var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.
const PORT = process.env.PORT || 8080;
let studentId;
let courseId;
var server = supertest.agent(`http://localhost:${PORT}`);

describe("Find All Students",function(){

  it("should return students json",function(done){
    server
    .get("/api/students")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should create student",function(done){
    server
    .post('/api/students')
    .send({name : "giu",age : 22})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.have.property("name", "giu");
      res.body.should.have.property("age", 22);
      res.body.should.have.property("courses", []);
      studentId = res.body.id
      done();
    });
  });
  
  it("should update student",function(done){
    server
    .put(`/api/students/${studentId}`)
    .send({name : "giuzera",age : 23})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.have.property("message", "Student was updated succesfully.");
      done();
    });
  });

  it("should create course",function(done){
    server
    .post(`/api/courses/`)
    .send({
        title : "Biologia do Prof Jubilut",
        description : "Curso muito bommm",
        available : true,
    })
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.have.property("title", "Biologia do Prof Jubilut");
      res.body.should.have.property("description", "Curso muito bommm");
      res.body.should.have.property("available", true);
      courseId = res.body.id
      done();
    });
  });

  it("should enroll student",function(done){
    server
    .put(`/api/students/enroll/${studentId}`)
    .send({courseId : courseId})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.have.property("message", "Student was sucessfully enrolled.");
      done();
    });
  });

  it("should detect missing name",function(done){
    server
    .post('/api/students')
    .send({age : 22})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(422);
      res.body.should.have.property("message", "Name can not be empty!");
      done();
    });
  });



});