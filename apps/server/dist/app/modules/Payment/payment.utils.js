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
exports.SearchPaymentByDateRangeQueryMaker = exports.SearchPaymentByUserQueryMaker = exports.verifyPayment = exports.initiatePayment = exports.generateTransactionId = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const payment_model_1 = require("./payment.model");
const payment_constant_1 = require("./payment.constant");
dotenv_1.default.config();
const generateTransactionId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomNum = Math.floor(Math.random() * 1e12).toString(36); // Generate a random number and convert to base-36
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
    return `TX-${timestamp}-${randomNum}-${randomString}`.toUpperCase(); // Combine parts and return in uppercase
};
exports.generateTransactionId = generateTransactionId;
const initiatePayment = (paymentData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, customerEmail } = paymentData;
    const transactionId = (0, exports.generateTransactionId)();
    const response = yield axios_1.default.post(process.env.PAYMENT_URL, {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        tran_id: transactionId,
        success_url: `${config_1.default.server_url}/api/v1/payment/confirmation?transactionId=${transactionId}&userId=${userId}`,
        fail_url: `${config_1.default.server_url}/api/v1/payment/failed?transactionId=${transactionId}&userId=${userId}`,
        cancel_url: `${config_1.default.client_url}`,
        amount: 20,
        currency: "USD",
        desc: "Merchant Registration Payment",
        cus_name: customerName,
        cus_email: customerEmail,
        cus_add1: `Dhaka,Bangladesh`,
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "N/A",
        cus_postcode: "N/A",
        cus_country: "Bangladesh",
        cus_phone: "N/A",
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(process.env.PAYMENT_VERIFY_URL, {
        params: {
            store_id: process.env.STORE_ID,
            signature_key: process.env.SIGNATURE_KEY,
            request_id: transactionId,
            type: "json",
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
const SearchPaymentByUserQueryMaker = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const userQuery = new QueryBuilder_1.QueryBuilder(payment_model_1.Payment.find(), query).search(payment_constant_1.paymentSearchableFields);
        const payments = yield userQuery.modelQuery;
        if (payments && payments.length > 0) {
            const userIds = payments.map((payment) => payment.userId);
            query["userId"] = { $in: userIds };
            /**
             * query['user'] = {
             * $in: [
             * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
             * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
             * ]
             */
            delete query.searchTerm;
            return query;
        }
    }
});
exports.SearchPaymentByUserQueryMaker = SearchPaymentByUserQueryMaker;
const SearchPaymentByDateRangeQueryMaker = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if ((query === null || query === void 0 ? void 0 : query.from) || (query === null || query === void 0 ? void 0 : query.to)) {
        const dateQuery = {};
        if (query.from) {
            dateQuery["$gte"] = new Date(query.from);
        }
        if (query.to) {
            dateQuery["$lte"] = new Date(query.to);
        }
        if (Object.keys(dateQuery).length > 0) {
            query["dateFound"] = dateQuery;
        }
        delete query.from;
        delete query.to;
        return query;
    }
    return query;
});
exports.SearchPaymentByDateRangeQueryMaker = SearchPaymentByDateRangeQueryMaker;
