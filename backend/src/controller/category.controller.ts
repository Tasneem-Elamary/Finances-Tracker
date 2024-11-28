import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextFunction, Request, Response } from 'express';




export const getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories' });
    }
  };

  
  export const addCategory = async (req: Request, res: Response) => {
    const { name} = req.body;
  
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).send({ msg: 'image file is required' })
      };
      const category = await prisma.category.create({
        data: {
          name,
          image:filePath
        },
      });
  
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error adding category' });
    }
  };