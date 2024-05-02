const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport(
    {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'nelson.dubuque63@ethereal.email',
        pass: 'KbtvSw8zr2a31yMtrt'
        }
    }
);

async function sendEmail(options) {
    await transporter.sendMail(
        {
            from: 'rod.runolfsdottir@ethereal.email', // sender address
            to: options.userEmail, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plain text body
            html: options.html, // html body
        }
    )
}

module.exports = sendEmail;