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
exports.User = void 0;
/* eslint-disable no-useless-escape */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.keys(user_constant_1.USER_ROLE),
        required: true,
    },
    email: {
        type: String,
        required: true,
        //validate email
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        // required: true,
        select: 0,
    },
    status: {
        type: String,
        enum: Object.keys(user_constant_1.USER_STATUS),
        default: user_constant_1.USER_STATUS.ACTIVE,
    },
    passwordChangedAt: {
        type: Date,
    },
    mobileNumber: {
        type: String,
        // required: true,
        default: "",
    },
    profilePhoto: {
        type: String,
        default: null,
    },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    bio: { type: String, default: "" },
    shortBio: { type: String, default: "" },
    nickName: { type: String, unique: true, sparse: true },
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            gpa: { type: String },
        },
    ],
    socialMedia: [
        {
            platform: { type: String },
            url: { type: String },
        },
    ],
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    isPremium: { type: Boolean, default: false },
    subscriptionStartDate: { type: String, default: "" },
}, {
    timestamps: true,
    virtuals: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this; // doc
        // hashing password and save into DB
        if (user.password) {
            user.password = yield bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// set '' after saving password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
