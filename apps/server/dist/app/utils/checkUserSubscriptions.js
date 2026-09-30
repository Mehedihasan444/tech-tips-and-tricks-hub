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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserSubscriptions = void 0;
const user_model_1 = require("../modules/User/user.model");
const checkUserSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        // Find all users with premium access
        const users = yield user_model_1.User.find({ isPremium: true });
        users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            const subscriptionStartDate = new Date(user.subscriptionStartDate);
            const diffInTime = currentDate.getTime() - subscriptionStartDate.getTime();
            const diffInMonths = diffInTime / (1000 * 3600 * 24 * 30); // Convert time difference into months
            if (diffInMonths >= 1) {
                // Use MongoDB's $set operator to directly update the isPremium field
                yield user_model_1.User.updateOne({ _id: user._id }, // Match the user by _id
                { $set: { isPremium: false } } // Set isPremium to false
                );
                console.log(`User ${user.email} has had their premium access revoked.`);
            }
        }));
    }
    catch (error) {
        console.error("Error checking subscriptions:", error);
    }
});
exports.checkUserSubscriptions = checkUserSubscriptions;
