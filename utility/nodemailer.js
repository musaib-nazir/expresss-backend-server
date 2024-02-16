const nodeMailer = require("nodemailer")

const transporter = nodeMailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "musi7780@gmail.com",
      pass: "nbzh pxyu ivxx roqk",
    },
  });

  module.exports =  transporter 