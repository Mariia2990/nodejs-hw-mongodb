import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRouter from "./auth.js";

const router = Router();

router.post('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
