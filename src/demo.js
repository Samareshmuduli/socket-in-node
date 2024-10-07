const bcrypt = require('bcryptjs');
const User = require('../model/personSchema');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
/** User registration
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.register = async (req, res) => {
  console.log("============",req.body);
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { name, email, password } = req.body;
  if(password=="")return res.status(400).json({ message: 'please enter password' }); 
  // console.log(req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' }); 
    }
    const existingUsername = await User.findOne({ name : name });
    if (existingUsername) {
      return res.status(409).json({ message: 'username already registered' }); 
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, "Xty139@qt", { expiresIn: '1d' });
    const user = new User ({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });
    // console.log(user);
    const newUser = await user.save().then((userNew) => {
      console.log("User Data", userNew);

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Your SMTP host
      port: 587, // Common port for SMTP (use 465 for secure)
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.user, // Your SMTP username
        pass: process.env.pass // Your SMTP password
      }
    });
    

    const verificationLink = `http://localhost:2000/users/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: 'samaresh.muduli@gmail.com',
      to: userNew.email,
      subject: 'Verify your email address',
      text: `Please click the following link to verify your email address: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).json({ message: 'Registration successful! Please verify your email.' });
      }
    });
  });

    // res.status(201).json(newUser); // Created
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message }); 
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, "Xty139@qt");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove the verification token
    await user.save();

    res.status(200).json("Email verified successfully");
  } catch (err) {
    res.status(400).json('Invalid or expired token');
  }
};

/** User login
 * author:samaresh
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { email, password } = req.body;

  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }
    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' }); 
    }
    // console.log(user)
    // Create a JWT token
    const token = jwt.sign({ id: user._id }, "Xty139@qt", { expiresIn: '1d' });
    // console.log()
    res.status(200).json({ message: 'Logged in successfully', access_token: token ,id: user._id,username:user.name,status:user.status,email:user.email}); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
exports.googleLogin = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { email} = req.body;
console.log("body",req.body)
  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }else{}
  //   if (!user.isVerified) {
  //     return res.status(401).json({ message: 'Please verify your email first' });
  //   }
  
    // console.log(user)
    // Create a JWT token
    const token = jwt.sign({ id: user._id }, "Xty139@qt", { expiresIn: '1d' });
    // console.log()
    res.status(200).json({ message: 'Logged in successfully', access_token: token ,id: user._id,username:user.name,status:user.status,email:user.email}); 
   } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
