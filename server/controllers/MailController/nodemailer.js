require('dotenv').config();
const nodemailer = require("nodemailer");

// reusable transporter built from env credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// single place that actually sends an email
async function sendEmail(subject, html, to) {
  return transporter.sendMail({
    from: `"BeatBonds" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// setTimeout can only be trusted up to ~24.8 days (2^31-1 ms)
const MAX_TIMEOUT = 2147483647;

module.exports.sendMail = async function sendMail(req, res) {
  const data = req.body.data;
  const str = req.body.str;

  try {
    if (str == "lobby created") {
      const Osubject = `dear ${data.name} u've subscribed for a lobby`;
      const Ohtml = `
        <h1>Lobby Subscribed</h1>
        U have subscribed to our lobby
        which has the following details :
        venue : ${data.venue}
        to meet  : ${data.guest}
        time and data : ${data.timeAndDate}

        have ur plans set up for a beatBonds journey !
      `;

      const info = await sendEmail(Osubject, Ohtml, data.email);
      return res.json({ email: info });
    }
    else if (str == "lobby is scheduled") {
      const Osubject = `dear ${data.name} u've a lobby scheduled`;
      const Ohtml = `
        <h1>Lobby Scheduled</h1>
        U have a lobby scheduled :
        venue : ${data.venue}
        to meet  : ${data.guest}
        time and data : ${data.timeAndDate}

        so gear up quick for a beatBonds journey !
      `;

      // remind 30 minutes before the meet. data.timeAndDate arrives as a
      // JSON string, so parse it natively instead of calling dayjs methods on it.
      const notifyAt = new Date(data.timeAndDate).getTime() - 30 * 60 * 1000;
      const delay = notifyAt - Date.now();

      if (!Number.isNaN(delay) && delay > 0 && delay <= MAX_TIMEOUT) {
        // NOTE: an in-process timer is fine for a prototype but is lost on
        // restart; a durable job queue is the production-grade approach.
        setTimeout(() => {
          sendEmail(Osubject, Ohtml, data.email).catch((err) =>
            console.log("scheduled reminder failed to send:", err.message)
          );
        }, delay);
        return res.json({ message: "Reminder scheduled" });
      }

      return res.json({
        message: "Reminder not scheduled (meet time is in the past or too far out)",
      });
    }
    else {
      return res.status(400).json({ message: "unknown mail type" });
    }
  } catch (error) {
    return res.status(500).json({ message: `failed to send mail: ${error.message}` });
  }
};
