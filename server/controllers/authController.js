
const { hashPassword, comparePassword } = require("../helpers/auth");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const test = (req, res) => {
  res.json("test is working");
};

// register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //  if(!name && !email && !password){
    //   return res.json({
    //       error: "Please enter the details!",
    //     });
    //  }
    //  else{
    //  check for valid name
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    // check for valid password
    if (!password || password.length < 6) {
      return res.json({
        error: "Password must be greater than 6 characters",
      });
    }
    // check for valid email
    const exist = await User.findOne({ email });
    // if (!email) {
    //   return res.json({
    //     error: "Email is Required!",
    //   });
    // }
    if (exist) {
      return res.json({
        error: "Email Already Exists!",
      });
    }
    //  }
    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user Found!",
      });
    }

    // check if password matches
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '3d'},
        (err, token) => {
          if (err) throw err;
        res.cookie("token", token,  {
          maxAge: 3 * 24 * 60 * 60 * 1000}).json(user);
        }
      );
    }
    if (!match) {
      res.json({
        error: "Wrong Password!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};










// user Profile
const getProfile = (req, res) => {
  const token  = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile
};
