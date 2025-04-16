import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Server URL ${API_URL}`);
    });
});