const express = require('express');
const dotenv = require('dotenv').config();
// const cors = require('cors');
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')



const app = express();
app.use(bodyParser.json());

//Localhost PORT______________________________________________________
app.listen(2424)
app.get("/", (req, res) => res.send("Backend is created successfully...!"));

//database connection_________________________________________________
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected..!'))
    .catch((err) => console.log('not connect...!', err))

//middleware__________________________________________________________
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))


//Router for backend __________________________________________________
app.use('/', require('./Compnt/RouterHD'));




// ...................... Email Sending BACKEND (start)..............................
app.post('/send-email', (req, res) => {
    const { name, email, comment, phonenumber } = req.body;
  
    // Create a transporter using nodemailer with your Gmail SMTP credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465 ,
      auth: {
          user: 'dangodarahardik363@gmail.com',
          pass: 'kpvt soik vaef fvjl'
      }
    });
  
    // Setup email data
    const mailOptions = {
      from: 'dangoddarahardik363@gmail.com',
      to: email,
      subject: 'Customer Enquiry..for HD virtuality',
      text: `${name}\t
            ${phonenumber}\t
            ${comment}`
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });
// .................................Email Sending BACKEND (End)........................

