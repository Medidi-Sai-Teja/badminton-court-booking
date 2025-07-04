
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const crypto = require('crypto');
require('dotenv').config();



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected')) 
  .catch((err) => console.log(err));



  // Session configuration
  const store = new MongoDBStore({
    uri: process.env.DB_CONNECTION_STRING,
    collection: 'sessions',
  });
  
  

  const generateSecretKey = () => {
    const length = 32; // Adjust the length based on your needs
    return crypto.randomBytes(length).toString('hex');
};
  app.use(
    session({
      secret: generateSecretKey, // Change this to a secret key
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session timeout: 1 day
      },
    })
  );



// Nodemailer Configuration

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user : process.env.ADMIN_GMAIL,
    pass: process.env.ADMIN_GMAIL_PASSWORD
  }, 
}); 
 

// API Endpoints

// Signed Up Student Schema for Collection in Database
const StudentSchema = new mongoose.Schema({
  name: String,
  rollNumber: {
    type: String,
    required: true,
    unique: true, // Ensures uniqueness
  },
  email: String,
  branch: String,
  section: String,
  password: String,
});

// Creating Student collection in database using NewStudentSchema
const Student = mongoose.model('Student', StudentSchema);


// SignUp API
app.post('/signup', (req,res)=>{
  console.log(req.body);
  const {name, rollNumber, email, branch, section, password} = req.body;
  const newStudent = new Student({
    name,
    rollNumber,
    email,
    branch,
    section,
    password,
  })
  
  newStudent
  .save()
  .then(() => 
  {
    const StudentSignedUpAcknowledgeMail = {
      from: process.env.ADMIN_GMAIL, // SENDER GMAIL ID
      to: email,
      subject: 'Registered in Batminton Court Booking Application',
      text: `You have registered in Batminton Court Application`,
    };

    transporter.sendMail(StudentSignedUpAcknowledgeMail, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('email sent: ' + info.response);
      }
    });


    // Save student details to session
    req.session.student = {
      name,
      rollNumber,
      email,
      branch,
      section,
      password
    };

    res.json({ message: `Successfully Registered!!`});
  })
  .catch((err) => 
  {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.rollNumber) {
      // Duplicate key error (code 11000) for the rollNumber field
      res.status(400).json({ error: `Student with the Roll Number ${rollNumber} has already registered.` });
    }
    else {
      res.status(400).json({ error: 'Problem in Registration!' });
    }

    console.log(err);
  });
  
});

// Log in API
app.post('/login', (req, res) => {
  const {name, rollNumber, email, password} = req.body;
  Student.findOne({name, rollNumber, email, password })
    .then((student) => {
      if (student) {
        const StudentLoggedInAcknowledgeMail = {
          from: process.env.ADMIN_GMAIL, // SENDER GMAIL ID
          to: email,
          subject: 'Login Activity in Batminton Court Booking Application',
          text: `You have logged into Batminton Court Application`,
        };
    
        transporter.sendMail(StudentLoggedInAcknowledgeMail, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('email sent: ' + info.response);
          }
        });
 
        // Save student details to session
        // req.session.student = {
        //   name,
        //   rollNumber,
        //   email,
        //   section,
        //   password
        //   // Add other details as needed
        // };

    
        res.json({ message: `Welcome ${student.name}!`, user: student });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Database server error' });
      console.error(err);
    });
});



// Booking Model
const BookingSchema = new mongoose.Schema({
  studentName: String,  // session variable
  rollNumber: String,   // session variable
  section: String,      // session variable
  courtNumber: Number,
  matchDate: Date,
  timeSlot: String,
  bookingDate: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', BookingSchema);
 


// Bookings APIs

app.post('/bookings', (req, res) => {
  console.log(req.body);
  const { courtNumber, matchDate, timeSlot } = req.body;
  const { student } = req.session;

  // Check if the student is logged in
  if (!student) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  // Check if the provided student details match the session details
  if (
    student.name !== studentName ||
    student.rollNumber !== rollNumber ||
    student.section !== section
    // Add other checks as needed
  ) {
    return res.status(403).json({ error: 'Forbidden. Invalid student details.' });
  }

// section wise sport period
  const sportsPeriodTimings = {
    A: { day: 'Tuesday', timeSlot: '02:30-03:45' },
    B: { day: 'Wednesday', timeSlot: '03:45-04:30' },
    C: { day: 'Thursday', timeSlot: '04:30-05:30' },
  };
  const matchDay = new Date(matchDate).toLocaleDateString('en-US', { weekday: 'long' });

  if (sportsPeriodTimings[section] && sportsPeriodTimings[section].day === matchDay && sportsPeriodTimings[section].timeSlot === timeSlot) {

    const newBooking = new Booking({
      studentName,
      rollNumber,
      section,
      courtNumber,
      matchDate,
      timeSlot,
      bookingDate: new Date(),
    });
  
    newBooking
      .save()
      .then(() => 
      {
        const bookingUpdateMailOptions = {
          from: user, // SENDER GMAIL ID
          to: email,
          subject: 'Booking Successful',
          text: `You have successfully booked Batminton Court!!\nCourt Number: ${courtNumber}\nMatch Date: ${matchDate} (${matchDay})\nSlot Timing: ${timeSlot}`,
        };

        transporter.sendMail(bookingUpdateMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('email sent: ' + info.response);
          }
        });

        res.json({ message: `Booking added successfully!! You have booked Batminton Court of number ${courtNumber} for ${matchDate} (${matchDay}) at ${timeSlot} slot`});
      })
      .catch((err) => 
      {
        const bookingUpdateErrorMailOptions = {
          from: process.env.ADMIN_GMAIL, // SENDER GMAIL ID
          to: userEmail,
          subject: 'Booking Rejected',
          text: 'Your Batminton Court Booking was Rejected due to server problem!!',
        };

        transporter.sendMail(bookingUpdateErrorMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('email sent: ' + info.response);
          }
        });
        res.status(400).json({error: 'Your Batminton Court Booking was Rejected due to server problem!!'});
      });
  }
  else{
    const bookingUpdateErrorMailOptions = {
      from: '', // SENDER GMAIL ID
      to: userEmail,
      subject: 'Booking Rejected',
      text: `Booking Failed!!\nBecause you have a class on ${matchDate} (${matchDay}) at ${timeSlot}`,
    };

    transporter.sendMail(bookingUpdateErrorMailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('email sent: ' + info.response);
      }
    });

    res.json({ message: `Booking Failed!! You cannot book!! Because You have a class on ${matchDate} (${matchDay}) at ${timeSlot}`});
  }
  
});


// Start Server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});