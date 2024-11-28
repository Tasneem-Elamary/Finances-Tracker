import { Router } from 'express';
import { addBudget, getExpensesForAllBudgets } from '../controller/budget.controller';
import { isAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', isAuth, addBudget);
router.get('/expenses', isAuth, getExpensesForAllBudgets);

export default router;