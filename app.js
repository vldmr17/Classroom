// Express
const express = require("express");
const app = express();
app.use(express.json());

// MySQL
const mysql = require("mysql2");
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "classroom",
  password: ""
});

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Logging (Winston and Morgan)
var winston = require('./winston');
var morgan = require('morgan');
app.use(morgan('combined', { stream: winston.stream }));

// MARK: - Студенты

// добавление студента
app.post("/api/students/create", function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const age = req.body.age;

    pool.query("INSERT INTO students (name, surname, age) VALUES (?,?,?)", [name, surname, age], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// получение студентов
app.get("/api/students", function(req, res) {
    pool.query("SELECT * FROM students", function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// получить студента по id
app.get("/api/students/:id", function(req, res) {
    const id = req.params.id;

    pool.query("SELECT * FROM students WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// удаление студента по id
app.delete("/api/students/delete", function(req, res) {
    const id = req.body.id;

    pool.query("DELETE FROM students WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        //res.end(JSON.stringify(data));
        res.sendStatus(200);
    });
});

// изменение студента
app.put("/api/students/edit", function(req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const age = req.body.age;
    const id = req.body.id;

    pool.query("UPDATE students SET name=?, surname=?, age=? WHERE id=?", [name, surname, age, id], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// MARK: - Курсы

// добавление курса
app.post("/api/cources/create", function (req, res) {
    const name = req.body.name;
    const hours = req.body.hours;

    pool.query("INSERT INTO cources (name, hours) VALUES (?,?)", [name, hours], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// получение курсов
app.get("/api/cources", function(req, res) {
    pool.query("SELECT * FROM cources", function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// получить курса по id
app.get("/api/cources/:id", function(req, res) {
    const id = req.params.id;

    pool.query("SELECT * FROM cources WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// удаление курса
app.delete("/api/cources/delete", function(req, res) {
    const id = req.body.id;

    pool.query("DELETE FROM cources WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// изменение студента
app.put("/api/cources/edit", function(req, res) {
    const name = req.body.name;
    const hours = req.body.hours;
    const id = req.body.id;

    pool.query("UPDATE cources SET name=?, hours=? WHERE id=?", [name, hours, id], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// MARK: - Назначения курсов

// получение назначений курсов
app.get("/api/assignments", function (req, res) {
    pool.query("SELECT * FROM assignments", function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// получение назначения по id
app.get("/api/assignments/:id", function (req, res) {
    const id = req.params.id;

    pool.query("SELECT * FROM assignments WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        result={status:"success", data:data};
        res.json(result);
    });
});

// MARK: - События

// назначение курса
app.post("/api/assignments/create", function (req, res) {
    const studentId = req.body.studentId;
    const courseId = req.body.courseId;
    const isPassed = req.body.isPassed;

    pool.query("INSERT INTO assignments (studentId, courseId, isPassed) VALUES (?,?,?)", [studentId, courseId, isPassed], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// установка курса как сданного
app.put("/api/assignments/pass", function (req, res) {
    const isPassed = req.body.isPassed;
    const id = req.body.id;

    pool.query("UPDATE assignments SET isPassed=? WHERE id=?", [isPassed, id], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});

// удаление назначения курса
app.delete("/api/assignments/delete", function (req, res) {
    const id = req.body.id;

    pool.query("DELETE FROM assignments WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);

        res.sendStatus(200);
    });
});


app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});
