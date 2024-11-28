import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { getCurrencyConversionRate } from './currency.controller';
import { NextFunction, Request, Response } from 'express';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();


interface ExpenseSummary {
    categoryName: string;
    categoryImage: string;
    budgetAmount: Decimal;
    budgetCurrency:string,
    startDate: Date;
    endDate: Date;
    totalExpenses: number;
    progress: number;
  }
  


export const addBudget = async (req: Request, res: Response)  => {
    const userId =req.user?.userId as number
    const {  categoryName, amount, currency, startDate, endDate } = req.body;
  
    try {
      // Check for overlapping budgets in the same category
      const category = await prisma.category.findUnique({
        where: { name: categoryName },
      });
      const overlappingBudgets = await prisma.budget.findMany({
        where: {
          userId: Number(userId),
          categoryId: Number(category?.categoryId),
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) },
            },
          ],
        },
      });
  
      if (overlappingBudgets.length > 0) {
       res.status(400).json({
          error: 'A budget already exists for the same category and period.',
        });
      }
  
      // Create new budget
      const budget = await prisma.budget.create({
        data: {
          userId,
          categoryId:category?.categoryId as number,
          amount:parseFloat(amount),
          currency,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });
  
      res.status(201).json(budget);
    } catch (error) {
       res.status(400).json({ error: 'Error creating budget' });
    }
  };



  export const getExpensesForAllBudgets = async (req: Request, res: Response) => {
    const userId =req.user?.userId as number
    let { selectedStartDate, selectedEndDate } = req.query;
    const now = new Date();
    selectedStartDate = selectedStartDate || startOfMonth(now).toISOString(); // Start of current month
    selectedEndDate = selectedEndDate || endOfMonth(now).toISOString(); // End of current month
    console.log('Start Date:', selectedStartDate);
    console.log('End Date:', selectedEndDate);
  
    try {
      // Fetch budgets for the user
      const budgets = await prisma.budget.findMany({
        where: {
            userId: Number(userId),
            startDate: { lte: new Date(selectedEndDate as string) },
            endDate: { gte: new Date(selectedStartDate as string) },
          },
        include: { category: true },
      });
  
      const expenseSummary : ExpenseSummary[] = [];
      for (const budget of budgets) {
        const { budgetId, categoryId, amount: budgetAmount, currency: budgetCurrency, startDate, endDate, category } = budget;
  
        // Fetch transactions for this budget's category and period
        const transactions = await prisma.transaction.findMany({
          where: {
            categoryId,
            userId: Number(userId),
            transactionDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        });
  
        // Calculate total expenses (consider currency conversion if necessary)
        let totalExpenses = 0;
        for (const transaction of transactions) {
          const rate = await getCurrencyConversionRate(transaction.currency, budgetCurrency);
          totalExpenses += transaction.amount.toNumber() * rate;
        }
  
        // Add to summary
        expenseSummary.push({
          categoryName: category.name,
          categoryImage: category.image as string,
          budgetAmount,
          budgetCurrency,
          startDate,
          endDate,
          totalExpenses,
          progress: budgetAmount.toNumber() === 0 
          ? (totalExpenses > 0 ? 100 : 0) // Handle cases where budgetAmount is 0
          : (totalExpenses / budgetAmount.toNumber()) * 100,
        });
      }
  
      res.status(200).json(expenseSummary);
    } catch (error) {
      res.status(500).json({ error: 'Error calculating expenses' });
    }
  };



  