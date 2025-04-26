const FormEntry = require('../models/formEnteryModel');
const JobInward = require('../models/authorityModel');
const Agency = require('../models/agencyModel');

// Create a new reference
exports.createReference = async (req, res) => {
  try {
    const { fromDate, toDate, refraneName, authority, client } = req.body;

    // Check if authority exists
    const authorityExists = await JobInward.findById(authority);
    if (!authorityExists) {
      return res.status(400).json({ success: false, message: 'Authority not found' });
    }

    // Check if client exists
    const clientExists = await Agency.findById(client);
    if (!clientExists) {
      return res.status(400).json({ success: false, message: 'Client not found' });
    }

    const reference = new FormEntry({
      fromDate,
      toDate,
      refraneName,
      authority,
      client
    });

    await reference.save();

    res.status(201).json({ success: true, data: reference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all references
// Get all references with filters
exports.getAllReferences = async (req, res) => {
  try {
    const {
      refraneName,
      fromDate,
      toDate,
      authority, // should be _id of JobInward
      client     // should be _id of Agency
    } = req.query;

    const filter = {};

    if (refraneName) {
      filter.refraneName = { $regex: refraneName, $options: 'i' };
    }

    if (fromDate) {
      filter.fromDate = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      filter.toDate = filter.toDate || {};
      filter.toDate.$lte = new Date(toDate);
    }

    if (authority) {
      filter.authority = authority;
    }

    if (client) {
      filter.client = client;
    }

    const references = await FormEntry.find(filter)
      .populate('authority', 'clientName')
      .populate('client', 'ContractorName');

    res.status(200).json({ success: true, data: references });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get single reference by ID
exports.getReferenceById = async (req, res) => {
  try {
    const reference = await FormEntry.findById(req.params.id)
      .populate('authority', 'clientName')
      .populate('client', 'ContractorName');

    if (!reference) {
      return res.status(404).json({ success: false, message: 'Reference not found' });
    }

    res.status(200).json({ success: true, data: reference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update reference
exports.updateReference = async (req, res) => {
  try {
    const { fromDate, toDate, refraneName, authority, client } = req.body;

    // Check if authority exists
    if (authority) {
      const authorityExists = await JobInward.findById(authority);
      if (!authorityExists) {
        return res.status(400).json({ success: false, message: 'Authority not found' });
      }
    }

    // Check if client exists
    if (client) {
      const clientExists = await Agency.findById(client);
      if (!clientExists) {
        return res.status(400).json({ success: false, message: 'Client not found' });
      }
    }

    const reference = await FormEntry.findByIdAndUpdate(
      req.params.id,
      {
        fromDate,
        toDate,
        refraneName,
        authority,
        client,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!reference) {
      return res.status(404).json({ success: false, message: 'Reference not found' });
    }

    res.status(200).json({ success: true, data: reference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete reference
exports.deleteReference = async (req, res) => {
  try {
    const reference = await Reference.findByIdAndDelete(req.params.id);

    if (!reference) {
      return res.status(404).json({ success: false, message: 'Reference not found' });
    }

    res.status(200).json({ success: true, message: 'Reference deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};