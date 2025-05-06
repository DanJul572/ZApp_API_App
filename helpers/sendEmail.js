const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.zcodein.com',
    port: 465,
    secure: true,
    auth: {
        user: 'test@zcodein.com',
        pass: 'A;-KOiE#hWoM',
    },
});

const main = async () => {
    await transporter.sendMail({
        from: '"Dandi Juliandi 👻" <test@zcodein.com>',
        to: 'dandi@zcodein.com',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
    });
};

const sendEmail = () => {
    main().catch(console.error);
};

module.exports = {
    sendEmail,
};
