const Patient = require('../models/patientModel');
const OTP = require('../models/otpModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Helper function to generate patient ID
const Counter = require('../models/counterModel'); // Model for a counter collection

async function generatePatientID() {
    const counter = await Counter.findOneAndUpdate(
        { _id: 'patientID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return `IDPACHECK${counter.seq}`;
}


// Helper function to send OTP email
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP for registration is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error('Error sending OTP email');
  }
}

// OTP Request Controller (Step 1: Send OTP)
exports.requestOTP = async (req, res) => {
    const { email } = req.body;
  
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    try {
      // Check if there is already an OTP for this email
      const existingOTP = await OTP.findOne({ email });
      if (existingOTP) {
        // If OTP exists, ensure rate limiting (e.g., 1 request per minute)
        const timeElapsed = (Date.now() - new Date(existingOTP.createdAt).getTime()) / 1000; // Time in seconds
        if (timeElapsed < 60) {
          return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
        }
  
        // Delete the old OTP before creating a new one
        await OTP.deleteOne({ email });
      }
  
      // Set expiration time for OTP (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
      // Send OTP to the patient's email
      await sendOTPEmail(email, otp); // Send email first
  
      // Store the OTP in the database only after successful email sending
      const otpRecord = new OTP({
        email,
        otp,
        expiresAt,
      });
  
      await otpRecord.save();
  
      res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
      console.error(err);
  
      // Differentiate email sending errors
      if (err.message === 'Error sending OTP email') {
        return res.status(500).json({ message: 'Unable to send OTP. Please try again later.' });
      }
  
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  

// Signup Controller (Step 2: Verify OTP and Register Patient)
exports.signup = async (req, res) => {
  const { name, email, password, phone, gender, age, otp } = req.body;

  try {
    // Check if OTP exists in the database
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found for this email' });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ email }); // Delete expired OTP
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP is correct
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is correct, proceed with registration
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Generate custom patient ID
    const patientID = await generatePatientID();

    // Create a new patient
    const patient = new Patient({ name, email, password, phone, gender, age, role: 'patient', id: patientID });
    await patient.save();

    // Generate JWT token
    const token = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send JWT token in cookie
    res.cookie('token', token, {
      httpOnly: true,        // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      sameSite: 'Strict',    // Cookie is sent only for same-site requests
      maxAge: 3600000        // 1 hour expiration
    });

    // Clear OTP from database (it's no longer needed)
    await OTP.deleteOne({ email });

    res.status(201).json({
      message: 'User registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        patientID: patient.id,
        role: patient.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update lastVisit field to current date/time
    patient.lastVisit = new Date();
    await patient.save();

    // Generate JWT token with role
    const token = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send JWT token in cookie
    res.cookie('token', token, {
      httpOnly: true,        // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      sameSite: 'Strict',    // Cookie is sent only for same-site requests
      maxAge: 3600000        // 1 hour expiration
    });

    res.status(200).json({
      message: 'Login successful',
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        patientID: patient.id,
        role: patient.role,
        lastVisit: patient.lastVisit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
