var express = require('express');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'rajput.pushpendra62@gmail.com', // generated ethereal user
        pass: '7einfotech#@12' // generated ethereal password
    }
});
 

module.exports = transporter;

