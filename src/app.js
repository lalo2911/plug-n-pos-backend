import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './config/passport.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Routes
app.use('/api/v1', routes);

// Error Handler
app.use(errorHandler);

export default app;