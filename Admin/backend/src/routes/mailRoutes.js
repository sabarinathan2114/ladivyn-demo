import express from "express";
import { sendOrderMail, sendContactMail } from "../controllers/mailController.js";

const router = express.Router();

router.post("/order", sendOrderMail);
router.post("/contact", sendContactMail);

export default router;
