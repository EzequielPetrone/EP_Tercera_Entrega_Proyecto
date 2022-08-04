import nodemailer from "nodemailer"

const AUTH_USER = 'steve69@ethereal.email'
const AUTH_PASS = '6reV5J2USjCnA95u6z'

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: AUTH_USER,
        pass: AUTH_PASS
    }
});

/*
// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
*/

/*
//Ejemplo de mailOptions
const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
}
*/

async function sendEmail(mailOptions) {
    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    // Preview only available when sending through an Ethereal account
    return nodemailer.getTestMessageUrl(info)
}

export { sendEmail }

