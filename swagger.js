// const swaggerAutogen = require('swagger-autogen')()

// const outputFile = './swagger_output.json'
// const endpointsFiles = ['./src/app/routes/student.routes.js', './src/app/routes/course.routes.js']

// swaggerAutogen(outputFile, endpointsFiles).then(() => {
//     require('./server.js')
// })


const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "BT-API",
        description: "Simple documentation for BT-API."
    },
    host: "localhost:8080",
    basePath: "/api",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {
        Student: {
          name: "Giu",
          age: 22,
          courses: {
            $ref: '#/definitions/Course'
          }
        },
        Course: {
            title: "Course 1",
            description: "Cool course",
            available: true,
            students: {
              $ref: '#/definitions/Student'
            }
        }
    }
  
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/app/routes/student.routes.js', './src/app/routes/course.routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server')
})