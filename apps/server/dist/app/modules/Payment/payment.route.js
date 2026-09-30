"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.createPaymentValidationSchema), payment_controller_1.PaymentControllers.createPayment);
router.get("/", payment_controller_1.PaymentControllers.getAllPayments);
router.post("/confirmation", payment_controller_1.PaymentControllers.paymentConfirmation);
router.post("/failed", payment_controller_1.PaymentControllers.paymentFailed);
exports.PaymentRoutes = router;
