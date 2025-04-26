const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const jobInwardRoutes = require('./routes/jobInwardRoutes');
const jobAgencyRoutes = require('./routes/jobInwardAgencyRoutes');
const allJobInwarRoutes = require('./routes/allJobInwardRoutes');
const formentryRoutes = require('./routes/formEnteryRoutes')


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/users', userRoutes);
app.use('/api/jobinwards', jobInwardRoutes);
app.use('/api/agency', jobAgencyRoutes);
app.use('/api/alljobinwards', allJobInwarRoutes);
app.use('/api/formentry', formentryRoutes)

module.exports = app;       