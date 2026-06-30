require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');

const jwt_key = process.env.JWT_SECRET;

// shared cookie options for the auth cookie
const authCookieOptions = {
    httpOnly: true,
    secure: true,         // Required for HTTPS (which Render uses)
    sameSite: "None",     // Allows cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// signs a 7-day token for the given user id and sets it as a cookie
function issueAuthCookie(res, userId) {
    const token = jwt.sign({ payload: userId }, jwt_key, { expiresIn: '7d' });
    res.cookie("isLoggedIn", token, authCookieOptions);
}

async function loginUser(req, res) {
    try {
        let { userEmail, userPassword } = req.body;

        if (userEmail != '' && userPassword != '') {
            let user = await userModel.findOne({ email: userEmail });
            console.log("Tried user mail ", userEmail);
            if (user) {
                const passwordMatches = await user.comparePassword(userPassword);
                if (passwordMatches) {
                    issueAuthCookie(res, user._id);
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
                message: "enter email and password"
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

        // if user already exists, return response to avoid empty reply
        if (user) {
            issueAuthCookie(res, user._id);
            return res.json({
              success: true,
              message: "User already exists, logged in instead",
              data: user,
            });
          }

        // if user not found then create
        user = await userModel.create(userDetails);

        if(user) {
            issueAuthCookie(res, user._id);
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

        if (user) {
            const resetToken = user.createResetToken();
            await user.save({ validateBeforeSave: false });

            const resetPasswordLink = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

            // send the reset link by email instead of returning the token
            try {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                await transporter.sendMail({
                    from: `"BeatBonds" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: "Reset your BeatBonds password",
                    html: `<p>You requested a password reset.</p>
                           <p>Click the link below to set a new password (valid for 1 hour):</p>
                           <p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p>
                           <p>If you didn't request this, you can ignore this email.</p>`,
                });
            } catch (mailErr) {
                console.log("forgotPassword: failed to send email", mailErr.message);
            }
        }

        // generic response either way, so we don't reveal whether the email exists
        return res.json({
            message: "If an account exists for this email, a reset link has been sent."
        });

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
        let user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });
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
                message : "reset password : token is invalid or has expired"
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
    res.json({
        message : "the user was successfully logged out"
    });
}

module.exports = { loginUser, signupUser, isAuthorised, forgotPassword, resetPassword , logout };
