var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv').config();
const URL = process.env.MongoDB;

let unAssignedStudents = [];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Server Running Sucessfully');
});

// register Student
router.post('/registerStudent', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      req.body.mentorId = mongodb.ObjectId(req.body.mentorId);
      await db.collection('students').insertOne(req.body);
      await connection.close();
      res.status(200).json({ message: 'student profile created successfully' })
  } catch (error) {
      console.status(401).log(error);
  }
})

// Get student information
router.get('/getStudents', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let students = await db.collection('students').find().toArray();
      console.log(students);
      await connection.close();
      res.status(200).json(students);
  } catch (error) {
      console.status(401).log(error);
  }
})

// Create Mentor
router.post('/registerMentor', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      req.body.studentId = req.body.studentId.map(student => mongodb.ObjectId(student));
      console.log(req.body.studentId);
      console.log(req.body);
      await db.collection('mentors').insertOne(req.body);
      await connection.close();
      res.status(200).json({ message: 'Mentor profile created successfully' })
  } catch (error) {
      console.status(401).log(error);
  }
})

// Get mentor Details
router.get('/getMentor', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let mentors = await db.collection('mentors').find().toArray();
      await connection.close();
      res.status(200).json(mentors);
  } catch (error) {
      console.status(401).log(error);
  }
})


// Get UnAssigned Student Details
router.get('/getUnassignedStudents', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let students = await db.collection('students').find({ MentorAssigned: false }, { studentName: 1 }).toArray();
      students.forEach(student => {
          unAssignedStudents.push(student._id.toString());
      });
      console.log(unAssignedStudents);
      await connection.close();
      res.status(200).json(students);
  } catch (error) {
      console.status(401).log(error);
  }
})

// Assign mentor to student
router.put('/assignMentorToStudent/:id', async function (req, res) {
  try {
      console.log(req.body);
      m_id = mongodb.ObjectId(req.params.id) ;
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let assignStudents = req.body;
      studentId = req.body.map(student => mongodb.ObjectId(student));        
      await db.collection('students').updateMany({_id: {$in: studentId} },{$set: {mentorId: m_id, MentorAssigned : true }})    
      await connection.close();
      res.status(200).json({message: "successfully updated"});
  } catch (error) {   
      console.status(401).log(error);
  }
})

// Assign Student to Mentor
router.put('/assignStudentToMentor/:id', async function (req, res) {
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let student_id = req.body.map(student => mongodb.ObjectId(student)); 
      await db.collection('mentors').updateOne({ _id: mongodb.ObjectId(req.params.id)},{$set: {studentId : student_id}});
      await connection.close();
      res.status(200).json({ message: "successfully updated" })
  } catch (error) {
      console.status(401).log(error);
  } 
})

// Assign or change Mentor for particular Student
router.put('/assignMentorToStudent/:id', async function (req, res) {
  try {
      console.log(req.body);
      const studentId = mongodb.ObjectId(req.params.id) ;
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let assignMentor = mongodb.ObjectId(req.body);       
      await db.collection('students').updateMany({_id: {$in: studentId} },{$set: {mentorId: assignMentor, MentorAssigned : true }})    
      await connection.close();
      res.status(200).json({message: "successfully updated"});
  } catch (error) {   
      console.status(401).log(error);
  }
})

// API to show Students of Particular Mentor
router.get('/getMentor/:id', async function (req, res) {
  try {
      const m_id = mongodb.ObjectId(req.params.id);
      const connection = await mongoClient.connect(URL);
      const db = connection.db('student_mentor');
      let mentors = await db.collection('mentors').findOne({_id: m_id},{studentId : 1});
      await connection.close();
      res.status(200).json(mentors);
  } catch (error) {
      console.status(401).log(error);
  }
})


module.exports = router;
