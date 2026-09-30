"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const user_model_1 = require("../User/user.model");
const createPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = payload.userId;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const paymentData = {
        customerName: user === null || user === void 0 ? void 0 : user.name,
        customerEmail: user === null || user === void 0 ? void 0 : user.email,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData, userId);
    return paymentSession;
});
const paymentConfirmation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, userId, }) {
    let payment;
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        payment = yield payment_model_1.Payment.create({ userId, transactionId });
        yield user_model_1.User.findByIdAndUpdate(userId, {
            $set: {
                isPremium: true,
                subscriptionStartDate: new Date()
            },
        }, { new: true });
    }
    return payment;
});
const getAllPaymentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // query = (await SearchPaymentByUserQueryMaker(query)) || query;
    // // Date range search
    // query = (await SearchPaymentByDateRangeQueryMaker(query)) || query;
    const userId = query.userId;
    let result;
    if (userId) {
        result = payment_model_1.Payment.find({ userId }).populate("userId");
    }
    else {
        result = payment_model_1.Payment.find().populate("userId");
    }
    // const paymentQuery = new QueryBuilder(
    // query
    // )
    //   .filter()
    //   .search(paymentSearchableFields)
    //   .sort()
    //   .paginate()
    //   .fields();
    // const result = await paymentQuery.modelQuery;
    return result;
});
exports.PaymentServices = {
    createPayment,
    paymentConfirmation,
    getAllPaymentsFromDB,
};
