"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
// Define the schema
const PaymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
