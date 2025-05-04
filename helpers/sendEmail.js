const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.zcodein.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: 'test@zcodein.com',
        pass: 'A;-KOiE#hWoM',
    },
});

const main = async () => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: 'dandi@zcodein.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

const sendEmail = () => {
    main().catch(console.error);
};

module.exports = {
    sendEmail,
};
