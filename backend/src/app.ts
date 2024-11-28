import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv'; // To load environment variables

import budgetRouter from './route/budget.route';
import categoryRouter from './route/category.route';
import transactionRouter from './route/transaction.route';
import userRouter from './route/user.route';

// Load environment variables
dotenv.config();

console.log('PORT:', process.env.PORT);

const app = express();
app.use(express.json());
app.use(cors());

// Base URL for APIs
const baseUrl = '/api/v1';

// Define routes
app.use(`${baseUrl}/budget`, budgetRouter);
app.use(`${baseUrl}/category`, categoryRouter);
app.use(`${baseUrl}/transaction`, transactionRouter);
app.use(`${baseUrl}/user`, userRouter);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});