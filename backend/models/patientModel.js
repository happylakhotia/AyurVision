// models/patientModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Patient Schema
const patientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true,
  },
  lastVisit: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Encrypt password before saving to DB
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
patientSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
