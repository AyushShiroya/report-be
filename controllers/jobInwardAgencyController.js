const JobInward = require('../models/agencyModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new agency
// @route   POST /api/agencies
// @access  Private
exports.createAgency = asyncHandler(async (req, res) => {
  const {
    ContractorName,
    ContractorMobileNumber,
    ContractorAddress,
    city,
    ContractorPinCode,
    ContractorEmailId,
    ContractorGstNumber
  } = req.body;

  // Simple validation
  if (!ContractorName || !ContractorMobileNumber || !ContractorAddress || !city || 
      !ContractorPinCode || !ContractorEmailId || !ContractorGstNumber) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Get user ID from the authenticated user
    const createdBy = req.user.id;

    const jobAgency = await JobInward.create({
      ContractorName,
      ContractorMobileNumber,
      ContractorAddress,
      city,
      ContractorPinCode,
      ContractorEmailId,
      ContractorGstNumber,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: jobAgency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Private
exports.getAllAgencies = asyncHandler(async (req, res) => {
  try {
    // Get agencies for the authenticated user only
    const agencies = await JobInward.find({ createdBy: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single agency
// @route   GET /api/agencies/:id
// @access  Private
exports.getAgency = asyncHandler(async (req, res) => {
  try {
    const agency = await JobInward.findOne({
      _id: req.params.id,
      createdBy: req.user.id // Ensure the agency belongs to the authenticated user
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    res.status(200).json({
      success: true,
      data: agency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private
exports.updateAgency = asyncHandler(async (req, res) => {
  try {
    const agency = await JobInward.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id // Ensure the agency belongs to the authenticated user
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    res.status(200).json({
      success: true,
      data: agency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete agency
// @route   DELETE /api/agencies/:id
// @access  Private
exports.deleteAgency = asyncHandler(async (req, res) => {
  try {
    const agency = await JobInward.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id // Ensure the agency belongs to the authenticated user
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
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