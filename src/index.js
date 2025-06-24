import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';
import { setupCronJobs } from './utils/cronJobs.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on mode ${NODE_ENV} in port ${PORT}`);
        console.log(`URL: ${API_URL}`);
        setupCronJobs();
    });
});
