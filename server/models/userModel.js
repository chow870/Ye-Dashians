// models/userModel.js

const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
  },
  resetToken : {
    type : String,
  },
  resetTokenExpiry : {
    type : Date,
  }

}, { timestamps: true });

userSchema.pre('save', async function () {
    // never persist the confirm-password field
    if (this.localUser) this.confirmpassword = undefined;

    // hash the password whenever it has been set/changed
    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// compares a plaintext candidate against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    this.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // valid for 1 hour
    return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
    this.password = password;            // re-hashed by the pre-save hook
    this.confirmpassword = confirmPassword;
    this.resetToken = undefined;
    this.resetTokenExpiry = undefined;
};





const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
