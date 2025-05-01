const JobInward = require('../models/JobInward');
const fs = require('fs');
const path = require('path');

// Helper function to handle file uploads
const uploadFiles = (files, jobId) => {
    const uploadDir = path.join(__dirname, '../uploads', jobId.toString());
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    return files.map(file => {
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return {
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            lastModified: Date.now(),
            path: filePath
        };
    });
};

// Create a new job inward
exports.createJobInward = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { body } = req;

        const jobInwardData = {
            ...body,
            createdBy: req.user._id
        };

        if (req.files && req.files.length > 0) {
            jobInwardData.documents = req.files.map(file => ({
                name: file.originalname,
                size: file.size,
                type: file.mimetype,
                path: file.path, // This is provided by diskStorage
                lastModified: Date.now()
            }));
        }

        const jobInward = new JobInward(jobInwardData);
        await jobInward.save();

        res.status(201).json({
            success: true,
            data: jobInward,
            message: 'Job inward created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all job inwards
// Get all job inwards with filtering
exports.getAllJobInwards = async (req, res) => {
    try {
        // Extract filter parameters from query string
        const {
            clientName,
            contractorName,
            workName,
            agreementNumber,
            letterDate,
            pmc,
            witness,
            thirdTitle,
            fourthTitle,
            letterNo,
            sampleReceivedDate,
            inwardNumber
        } = req.query;

        // Build the filter object based on query params
        const filter = {};


        if (clientName) filter['clientId.clientName'] = new RegExp(clientName, 'i');
        if (contractorName) filter['contractorId.ContractorName'] = new RegExp(contractorName, 'i');
        if (workName) filter['workName'] = new RegExp(workName, 'i');
        if (agreementNumber) filter['agreementNumber'] = new RegExp(agreementNumber, 'i');
        if (letterDate) filter['letterDate'] = new Date(letterDate);
        if (pmc) filter['pmc'] = new RegExp(pmc, 'i');
        if (witness) filter['witness'] = new RegExp(witness, 'i');
        if (thirdTitle) filter['thirdTitle'] = new RegExp(thirdTitle, 'i');
        if (fourthTitle) filter['fourthTitle'] = new RegExp(fourthTitle, 'i');
        if (letterNo) filter['letterNo'] = new RegExp(letterNo, 'i');
        if (sampleReceivedDate) filter['sampleReceivedDate'] = new Date(sampleReceivedDate);
        if (inwardNumber) filter['inwardNumber'] = new RegExp(inwardNumber, 'i');

        const jobInwards = await JobInward.find(filter)
            .populate('clientId', 'clientName')
            .populate('contractorId', 'ContractorName')
            .populate('createdBy', 'name');

        res.status(200).json({
            success: true,
            data: jobInwards,
            count: jobInwards.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get single job inward by ID
exports.getJobInwardById = async (req, res) => {
    try {
        const jobInward = await JobInward.findById(req.params.id)
            .populate('clientId')
            .populate('contractorId')
            .populate('createdBy');

        if (!jobInward) {
            return res.status(404).json({
                success: false,
                message: 'Job inward not found'
            });
        }

        res.status(200).json({
            success: true,
            data: jobInward
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update job inward
exports.updateJobInward = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, userId } = req;

        const jobInward = await JobInward.findById(id);
        if (!jobInward) {
            return res.status(404).json({
                success: false,
                message: 'Job inward not found'
            });
        }

        // Handle file updates
        if (req.files && req.files.length > 0) {
            // Remove old files if needed
            if (jobInward.documents && jobInward.documents.length > 0) {
                jobInward.documents.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }

            body.documents = req.files.map(file => ({
                name: file.originalname,
                size: file.size,
                type: file.mimetype,
                path: file.path,
                lastModified: Date.now()
            }));
        }

        const updatedJobInward = await JobInward.findByIdAndUpdate(
            id,
            { ...body, updatedBy: userId },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedJobInward,
            message: 'Job inward updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete job inward
exports.deleteJobInward = async (req, res) => {
    try {
        const jobInward = await JobInward.findById(req.params.id);
        if (!jobInward) {
            return res.status(404).json({
                success: false,
                message: 'Job inward not found'
            });
        }

        // Remove associated files
        if (jobInward.documents && jobInward.documents.length > 0) {
            jobInward.documents.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });

            // Remove the directory
            const uploadDir = path.join(__dirname, '../uploads', jobInward._id.toString());
            if (fs.existsSync(uploadDir)) {
                fs.rmdirSync(uploadDir, { recursive: true });
            }
        }

        await jobInward.remove();

        res.status(200).json({
            success: true,
            message: 'Job inward deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getJobStats = async (req, res) => {
    try {
        const totalJobs = await JobInward.countDocuments();

        const uniqueClients = await JobInward.distinct('clientId');
        const totalClients = uniqueClients.length;

        const uniqueContractors = await JobInward.distinct('contractorId');
        const totalContractors = uniqueContractors.length;

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                totalClients,
                totalContractors
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get monthly job inward statistics
exports.getMonthlyJobInwardStats = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        // Group by month and count job inwards for the current year
        const monthlyStats = await JobInward.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Initialize an array with all months set to 0
        const result = Array(12).fill(0);
        
        // Fill in the counts from the aggregation
        monthlyStats.forEach(month => {
            result[month._id - 1] = month.count; // _id is 1-12 (month numbers)
        });

        res.status(200).json({
            success: true,
            data: result,
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};