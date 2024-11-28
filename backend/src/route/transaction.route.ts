import { Router } from 'express';
import { addTransaction,getAllTransactions,getTransactionsSummaryByCategory} from '../controller/transaction.controller';
import { isAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', isAuth, addTransaction);
router.get('/', isAuth,getAllTransactions);
router.get('/piechart', isAuth,getTransactionsSummaryByCategory);

export default router;