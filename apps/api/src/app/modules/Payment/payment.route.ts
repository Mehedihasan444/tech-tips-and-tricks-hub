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
  PaymentControllers.createPayment,
);
router.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN), PaymentControllers.getAllPayments);
// AamarPay redirects the customer's browser to success/fail URLs (GET) and may also
// POST server-to-server callbacks. Accept both so confirmation is never a 404.
router
  .route("/confirmation")
  .get(PaymentControllers.paymentConfirmation)
  .post(PaymentControllers.paymentConfirmation);
router
  .route("/failed")
  .get(PaymentControllers.paymentFailed)
  .post(PaymentControllers.paymentFailed);

export const PaymentRoutes = router;
