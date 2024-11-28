import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';


const prisma = new PrismaClient();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET ; 

// Signup API
export const signup = async (req: Request, res: Response):Promise<void> => {
  const { username, password, email, country } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        email,
        country,
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.userId });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Signin API
export const signin = async (req: Request, res: Response) :Promise<void>=> {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
       res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user?.userId }, JWT_SECRET as any, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token,userId:user?.userId });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

