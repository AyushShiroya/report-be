const JobInward = require('../models/authorityModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new job inward
// @route   POST /api/jobinwards
// @access  Private
exports.createJobInward = asyncHandler(async (req, res) => {
  const {
    clientName,
    clientMobileNumber,
    clientAddress,
    city,
    clientPinCode,
    clientEmailId,
    clientGstNumber
  } = req.body;

  // Simple validation
  if (!clientName || !clientMobileNumber || !clientAddress || !city || 
      !clientPinCode || !clientEmailId || !clientGstNumber) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Get user ID from the authenticated user
    const createdBy = req.user.id;

    const jobInward = await JobInward.create({
      clientName,
      clientMobileNumber,
      clientAddress,
      city,
      clientPinCode,
      clientEmailId,
      clientGstNumber,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: jobInward
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get all job inwards
// @route   GET /api/jobinwards
// @access  Private
exports.getAllJobInwards = asyncHandler(async (req, res) => {
  try {
    // Get job inwards for the authenticated user only
    const jobInwards = await JobInward.find({ createdBy: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobInwards.length,
      data: jobInwards
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single job inward
// @route   GET /api/jobinwards/:id
// @access  Private
exports.getJobInward = asyncHandler(async (req, res) => {
  try {
    const jobInward = await JobInward.findOne({
      _id: req.params.id,
      createdBy: req.user.id // Ensure the job belongs to the authenticated user
    });

    if (!jobInward) {
      return res.status(404).json({ message: 'Job inward not found' });
    }

    res.status(200).json({
      success: true,
      data: jobInward
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update job inward
// @route   PUT /api/jobinwards/:id
// @access  Private
exports.updateJobInward = asyncHandler(async (req, res) => {
  try {
    const jobInward = await JobInward.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id // Ensure the job belongs to the authenticated user
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!jobInward) {
      return res.status(404).json({ message: 'Job inward not found' });
    }

    res.status(200).json({
      success: true,
      data: jobInward
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete job inward
// @route   DELETE /api/jobinwards/:id
// @access  Private
exports.deleteJobInward = asyncHandler(async (req, res) => {
  try {
    const jobInward = await JobInward.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id // Ensure the job belongs to the authenticated user
    });

    if (!jobInward) {
      return res.status(404).json({ message: 'Job inward not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});