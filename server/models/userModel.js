// models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mywebsite: {
    type: String,
  },
  officeadress: {
    type: String,
  },
  phoneno: {
    type: String,
  },
  
  profileImage:{
    type : String,
    default : 'img/users/default.jpeg'
  },
  password: {
    type: String,
    required: function () {
      return this.localUser; // Required only if localUser is true
    },
    minLength: 3,
  },
  confirmpassword: {
    type: String,
    required: function () {
      return this.localUser; // Required only if localUser is true
    },
    minLength: 3,
    validate: {
      validator: function (value) {
        // Only validate if localUser is true
        return !this.localUser || this.password === value;
      },
      message: 'Passwords do not match',
    },
  },
  lobbies : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'lobby',
    },
  ],
  localUser : {
    type : Boolean,
    default : false
  }

}, { timestamps: true });

userSchema.pre('save', function () {
    if(this.localUser)this.confirmpassword = undefined;
});

// userSchema.pre('save', async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedpassword = await bcrypt.hash(this.password, salt);
//     } catch (error) {
//         next(error);
//     }
// });

userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmpassword = confirmPassword;
    this.resetToken = undefined;
};





const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
