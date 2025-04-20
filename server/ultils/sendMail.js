const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // Email của bạn
            pass: process.env.EMAIL_APP_PASSWORD, // Mật khẩu ứng dụng
        },
        tls: {
            rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ SSL
        },
    });

    // Gửi email
    const info = await transporter.sendMail({
        from: '"Shop Digital" <no-reply@shopdigital.com>', // Địa chỉ email gửi
        to: email, // Địa chỉ email nhận
        subject, // Tiêu đề email
        html: html, // Nội dung email (HTML)
    });

    return info;
});

module.exports = sendMail;