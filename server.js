const express = require("express");
const cors = require("cors");

const db = require("./src/app/models");
const app = express();
const corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    })



app.get("/", (req, res) => {
    res.json({message: "HELLO WORLD DO RICKZINHO"});
})

require("./src/app/routes/student.routes")(app);
require("./src/app/routes/course.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


