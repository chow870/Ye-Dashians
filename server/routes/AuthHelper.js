const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const jwt_key = 'abcdefghijkl';

async function protectRoute(req, res, next) {
    try {
        let isLoggedIn = req.cookies.isLoggedIn;
        
        if (isLoggedIn) {
            let token = isLoggedIn;
            let isVerified = jwt.verify(token, jwt_key);
            if (isVerified) {
                
                let payload = isVerified.payload
                let user = await userModel.findById(payload)
                if(user)
                {
                    req.id = user.id
                    req.role = user.role
                   
                    next();
                }else{
                    return res.json({
                        message : "user entry not found in database"
                    })
                }   
            } else {
                return res.json({
                    message: "please login, operation not allowed"
                });
            }
        } else {
            const client = req.get('User-Agent');
            if(client.includes("Mozilla")==true)
            {
                return res.json({
                    message: "please login, operation not allowed"
                });

            }
            return res.json({
                message: "please login, operation not allowed"
            });
        }
    } catch (err) {
        return res.json({
            message : `some error occurred while authorising user , ${err.message}`
        })
    }

}

module.exports = { protectRoute };
