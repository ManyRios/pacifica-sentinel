import { Router } from "express";
import { getSystemStatus } from '../controllers/status.controller';
import { fundWallet, getBalances } from '../controllers/wallet.controller';

const router = Router();

router.get('/status', getSystemStatus);

router.get('/wallet/balance', getBalances);

router.post('/wallet/fund', fundWallet);

export default router;