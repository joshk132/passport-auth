const nodemailer = require('nodemailer');
const config = require('../config/config');
const transport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.mailgun.domain, // generated ethereal user
            pass: config.mailgun.password  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });
module.exports = function sendEmail(from, to, subject, message) {
    const mailOptions = {
        from,
        to,
        subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
        // console.log(`Message sent: ${info.response}`);
    });
};

// sendEmail('noreply@phantomam.com', 'feedback@phantomam.com', 'Dashboard Feedback', message);

// sendEmail = require('../utils/send-email');