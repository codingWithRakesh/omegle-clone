import express, { type Application } from 'express';
import cors from 'cors';
import errorHandler from "./middlewares/error.middleware.js";

const app : Application = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

import userRoutes from './routes/user.route.js';
import logicRoutes from './routes/logic.route.js';

app.use('/api/v2/user', userRoutes);
app.use('/api/v2/logic', logicRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Socket Server is running' });
});

app.use(errorHandler);

export default app;