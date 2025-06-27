const jwt = require('jsonwebtoken');
const jwt_key = 'abcdefghijkl';
const userModel = require('../models/userModel');

async function loginUser(req, res) {
    try {
        let { userEmail, userPassword } = req.body;

        if (userEmail != '' && userEmail != '') {
            let user = await userModel.findOne({ email: userEmail });
            console.log("Tried user mail ",userEmail);
            if (user) {
                if ((user.password == userPassword)) {
                    const uid = user._id;
                    const token = jwt.sign({ payload: uid }, jwt_key);
                    res.cookie("isLoggedIn", token, {
                       httpOnly: true,
                       secure: true,         // ⬅️ Required for HTTPS (which Render uses)
                       sameSite: "None",     // ⬅️ Allows cross-origin cookies
                       maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
                   });

                    return res.json({
                        success : true,
                        message: "user has logged in",
                        userDetails: user
                    });
                } else {
                    return res.json({
                        success : false,
                        message: "password entered is faulty"
                    });
                }
            } else {
                return res.json({
                    success : false,
                    message: "the user with such an email doesnt exist"
                });
            }
        } else {
            return res.json({
                success : false,
                message: "enter email"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: error.message
        });
    }
}


async function signupUser(req, res) {
    try {
        let userDetails = req.body;
        let user = await userModel.findOne({email : req.body.email});

        // ✅ ADDED: if user already exists, return response to avoid empty reply
        if (user) {
            // ✅ Return existing user and a token
            const uid = user._id;
            const token = jwt.sign({ payload: uid }, jwt_key);
            res.cookie("isLoggedIn", token, {
                       httpOnly: true,
                       secure: true,         // ⬅️ Required for HTTPS (which Render uses)
                       sameSite: "None",     // ⬅️ Allows cross-origin cookies
                       maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
                   });
      
            return res.json({
              success: true,
              message: "User already exists, logged in instead",
              data: user,
            });
          }

        // if user not found then create
        user = await userModel.create(userDetails);

        if(user) {
            const uid = user._id;
            const token = jwt.sign({ payload: uid }, jwt_key);
            res.cookie("isLoggedIn", token, {
                       httpOnly: true,
                       secure: true,         // ⬅️ Required for HTTPS (which Render uses)
                       sameSite: "None",     // ⬅️ Allows cross-origin cookies
                       maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
                   });

            return res.json({
                success : true,
                message: "new user registered successfully",
                data : user
            });
        }
        else {
            return res.json({
                success : false,
                message: "error in registering user "
            });
        }

    } catch (err) { 
        return res.json({
            success : false,
            message: `error while registering new user , ${err.message}`
        });
    }
}


// to verify the users role => admin or user or deliveryoby
function isAuthorised(roles) {
    return function (req, res, next) {
        if (roles.includes(req.role) == true) {
            next();
        }
        else {
            return res.status(401).json({
                // 401 means unauthorised access
                message: "operation not permitted to userd"
            });
        }
    }
}


async function forgotPassword(req, res) {
    let { email } = req.body;
    try {
        let user = await userModel.findOne({ email })
        // i could use 
        // let user = await userModel.findOne({email: userEmail})
        // but when variable names matched with key name 
        // then shorthand can be used 

        if (user) {
            const resetToken = user.createResetToken();
            // the above thing modifies our document in memory
            // now we will save our changes 
            await user.save({ validateBeforeSave: false });


            // what does createResetTokenDo ? 
            // actually in our schema there is a field 
            // called resetToken which was empty when the user was
            // created ! 
            // createResetToken generates a token and fills into the field and also
            // gives it to us at hand 

            let resetPasswordLink = `${req.protocol}://${req.get(
                "host"
            )}/resetpassword/${resetToken}`;

            // now send this link in the user's email
            // nodemailer  

            return res.json({
                message: `you will get an email with reset Token : ${resetToken}`
            });

        }
        else {
            return res.json({
                message: "forgotPassword : user with this email is not registered"
            });
        }

    } catch (err) {
        return res.json({
            message: `some error occurred while forgot password , ${err.message}`
        });
    }
}


async function resetPassword(req, res) {
    try {
        const token = req.params.token;
        // here this token will help us in getting to the user who 
        // has opted for a change of password
        let { password, confirmPassword } = req.body;
        let user = await userModel.findOne({ resetToken: token });
        // here the key name != variable name 
        // so shorthand could not be used 
        if(user)
        {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            return res.json({
                message : "your password has been changed successfully"
            });
        }
        else
        {
            return res.json({
                message : "reset password : user entry in database missing"
            });
        }
    } catch (err) {
        return res.json({
            message : `some error occurred while resetting your password ${err.message}`
        });
    }

}

function logout(req,res){
    res.cookie("isLoggedIn", "", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(0) // Immediately expires cookie
});

    // cookie ka naam // cookie ki value // extra options such as cookie ki age
    // what this does is basically destroys the cookie after 1ms
    res.json({
        message : "the user was successfully logged out"
    });
}

module.exports = { loginUser, signupUser, isAuthorised, forgotPassword, resetPassword , logout };
