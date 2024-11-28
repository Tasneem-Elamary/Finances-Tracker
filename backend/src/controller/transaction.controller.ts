import { PrismaClient } from '@prisma/client';
import { getCurrencyConversionRate } from './currency.controller';
import { NextFunction, Request, Response } from 'express';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const addTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.userId as number
  const { categoryName, amount, currency, transactionDate } = req.body;

  try {
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    // if (!category) {
    //   return res.status(404).json({ error: 'Category not found' });
    // }
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        categoryId:category?.categoryId as number,
        amount:parseFloat(amount),
        currency,
        transactionDate: new Date(transactionDate)

      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Error creating transaction' });
  }
};


export const getAllTransactions = async (req: Request, res: Response) => {
  const userId = req.user?.userId

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
      include: { category: true },
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching transactions' });
  }
};



export const getTransactionsSummaryByCategory = async (req: Request, res: Response) => {

  try {

    const userId = req.user?.userId
    let { selectedStartDate, selectedEndDate } = req.query;

    // If selectedStartDate or selectedEndDate are not provided, set defaults
    const now = new Date();
    selectedStartDate = selectedStartDate || startOfMonth(now).toISOString(); // Start of current month
    selectedEndDate = selectedEndDate || endOfMonth(now).toISOString(); // End of current month
    console.log('Start Date:', selectedStartDate);
    console.log('End Date:', selectedEndDate);
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        transactionDate: {
          gte: new Date(selectedStartDate as string),
          lte: new Date(selectedEndDate as string),
        },
      },
      include: {
        category: true, // Include category details
      },
    });

    // Classify and summarize transactions by category


    const categorySummary = await transactions.reduce(async (summaryPromise, transaction) => {
      const summary = await summaryPromise; // Wait for the accumulated summary
      const { category, amount, currency } = transaction;

      if (!summary[category.name]) {
        summary[category.name] = { totalAmount: 0, percentage: 0, count: 0 };
      }

      // Fetch the conversion rate and convert to USD
      const rate = await getCurrencyConversionRate(currency, 'USD');
      summary[category.name].totalAmount += amount.toNumber() * rate;
      summary[category.name].count += 1;

      return summary;
    }, Promise.resolve({} as Record<string, { totalAmount: number; percentage: number; count: number }>));

    // Calculate total expenses
    const totalExpenses = Object.values(categorySummary).reduce(
      (sum, category) => sum + category.totalAmount,
      0
    );

    // Calculate percentage for each category
    for (const categoryName in categorySummary) {
      categorySummary[categoryName].percentage =
        (categorySummary[categoryName].totalAmount / totalExpenses) * 100;
    }

    // Format data for pie chart
    const chartData = Object.entries(categorySummary).map(
      ([categoryName, data]) => ({
        categoryName,
        totalAmount: data.totalAmount,
        percentage: data.percentage,
        count: data.count,
      })
    );

    res.status(200).json({ totalExpenses, chartData });
  } catch (error: any) {
    console.error('Error fetching transactions summary:', error.message);
    res.status(500).json({ error: 'Error calculating transactions summary' });
  }
};
