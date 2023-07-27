/********************************************************************************* 
 * * WEB700 – Assignment 04 * I declare that this assignment is my own work in 
 * accordance with Seneca Academic Policy. No part * of this assignment has been 
 * copied manually or electronically from any other source * (including 3rd party 
 * web sites) or distributed to other students. 
 * * Name: ___David Oduwole_________ Student ID: __185731213_ Date: _July 27, 2023
 * * Online (Cyclic) Link: __https://lonely-lab-coat-duck.cyclic.app/#___________ * 
 * ********************************************************************************/

const express = require("express");
const path = require("path");
const fs = require("fs");
const collegeData = require("./collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// To import the express.static middleware
const staticMiddleware = express.static(path.join(__dirname, "public"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Initialize collegeData before starting the server
collegeData.initialize()
  .then(() => {
    // Routes

    // GET /students
app.get("/students", (req, res) => {
  const filePath = path.join(__dirname, "data", "students.json");

  // Read the students data from the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.json({ message: "Failed to read students data" });
    } else {
      try {
        const students = JSON.parse(data);
        if (students && students.length > 0) {
          if (req.query.course) {
            const course = parseInt(req.query.course);
            const courseStudents = students.filter(
              (student) => student.course === course
            );
            res.json(courseStudents);
          } else {
            res.json(students);
          }
        } else {
          res.json({ message: "No students found" });
        }
      } catch (parseError) {
        res.json({ message: "Failed to parse students data" });
      }
    }
  });
});

    // GET /tas
    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then(tas => {
          if (tas.length > 0) {
            res.json(tas);
          } else {
            res.json({ message: "no results" });
          }
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /courses
    app.get("/courses", (req, res) => {
  const path = require("path");
  const filePath = path.join(__dirname, "data", "courses.json");

  // Read the courses data from the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.json({ message: "Failed to read courses data" });
    } else {
      try {
        const courses = JSON.parse(data);
        if (courses && courses.length > 0) {
          res.json(courses);
        } else {
          res.json({ message: "No courses found" });
        }
      } catch (parseError) {
        res.json({ message: "Failed to parse courses data" });
      }
    }
  });
});


    // GET /student/num
    app.get("/student/:num", (req, res) => {
      const studentNum = parseInt(req.params.num);
      collegeData.getStudentByNum(studentNum)
        .then(student => {
          res.json(student);
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // GET /about
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
    });

    // GET /students/add
    app.get("/addStudent", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "addStudent.html"));
    });

    // POST /students/add
    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
        .then(() => {
          res.redirect("/students");
        })
        .catch(() => {
          res.status(500).json({ error: "Failed to add student" });
        });
    });

    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port:", HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
