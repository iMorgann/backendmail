const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { smtpServer, smtpPort, username, password, from, to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: parseInt(smtpPort),
      secure: smtpPort === 465, // Use secure connection for port 465
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Emails sent successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Failed to send email", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
