import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentValidation } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentControllers.createPayment
);
router.get("/", PaymentControllers.getAllPayments);
router.post("/confirmation", PaymentControllers.paymentConfirmation);
router.post("/failed", PaymentControllers.paymentFailed);


export const PaymentRoutes = router;
