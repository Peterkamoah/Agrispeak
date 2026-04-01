import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import chatRoutes from './modules/chat/chat.routes.js';
import asrRoutes from './modules/asr/asr.routes.js';
import { globalErrorHandler } from './core/middleware/error.middleware.js';
import AppError from './core/errors/AppError.js';

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Modules
app.use('/api/chat', chatRoutes);
app.use('/api/asr', asrRoutes);

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
