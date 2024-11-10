const nodemailer = require("nodemailer");



module.exports.sendMail = async function sendMail(req,res){
  const data = req.body.data;
  const str = req.body.str;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "ashutoshdigital@gmail.com",
          pass: "qibi jjqr sgnu qpkf",
        },
      });



      var Osubject,Otext,Ohtml;

      if(str=="lobby created")
      {
        Osubject = `dear ${data.name} u've subscribed for a lobby`;
        Ohtml = `
        <h1>Lobby Subscribed</h1>
        U have subscribed to our lobby
        which has the following details : 
        venue : ${data.venue}
        to meet  : ${data.guest}
        time and data : ${data.timeAndDate}

        have ur plans set up for a beatBonds journey !
        `


        const info = await transporter.sendMail({
          from: '"BeatBonds" <ashutoshdigital@gmail.com>', // sender address
          to: data.email, // list of receivers
          subject: Osubject, // Subject line
          html: Ohtml, // html body
        }); 
  
        res.json({
        email : info
      })


      }
      else if(str == "lobby is scheduled")
      {
        Osubject = `dear ${data.name} u've a lobby scheduled`;
        Ohtml = `
        <h1>Lobby Subscribed</h1>
        U have a lobby scheduled : 
        venue : ${data.venue}
        to meet  : ${data.guest}
        time and data : ${data.timeAndDate}

        so gear up quick for a beatBonds journey !
        `

        const notifyTime = data.timeAndDate.subtract(30, 'minutes');
        cron.schedule(
          `${notifyTime.format("m")} ${notifyTime.format("H")} ${notifyTime.format("D")} ${notifyTime.format("M")} *`,
          () => {
            sendEmail(Osubject, Ohtml, data.email);
          },
          { timezone: "your/timezone" } // Specify timezone if needed
        );

    
      res.json({ message: "Email scheduled if required" });
    };
    

      }
