const nodemailer = require("nodemailer");
require('dotenv').config()


const mailSender = async (email, title, body) => {
    try {
        console.log("Starting to send email...");
        console.log("Recipient:", email);
        console.log("Sender:", process.env.MAIL_USER);
        
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        // Verify connection
        await transporter.verify();
        console.log("SMTP connection verified successfully");

        let info = await transporter.sendMail({
            from: `${process.env.MAIL_USER}`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
        return info;
    } 
    catch(error) {
        console.log("Email sending error:", error.message);
        console.log("Full error:", error);
        throw error;
    }
}


module.exports = mailSender;