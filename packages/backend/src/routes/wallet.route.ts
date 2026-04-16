import { Router } from "express";
import { fundWallet, getBalances } from '../controllers/wallet.controller';

const router = Router();

router.get('/wallet/balance', getBalances);

router.post('/wallet/fund', fundWallet);

export default router;