import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { accounts } from '../services/db.js';

export const accountRouter = Router();

accountRouter.get('/balance', auth, (req, res) => {
    const acct = accounts.get(req.pin);
    res.json({ balance: acct.balance });
});

accountRouter.get('/card', auth, (req, res) => {
    const acct = accounts.get(req.pin);
    res.json({ holder: acct.holder, cardType: acct.cardType });
});