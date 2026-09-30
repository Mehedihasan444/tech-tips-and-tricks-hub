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
exports.seed = void 0;
const config_1 = __importDefault(require("../config"));
const user_constant_1 = require("../modules/User/user.constant");
const user_model_1 = require("../modules/User/user.model");
const generateNickname_1 = require("./generateNickname");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //at first check if the admin exist of not
        const admin = yield user_model_1.User.findOne({
            role: user_constant_1.USER_ROLE.ADMIN,
            email: config_1.default.admin_email,
            status: user_constant_1.USER_STATUS.ACTIVE,
        });
        if (!admin) {
            console.log("Seeding started...");
            yield user_model_1.User.create({
                name: "Admin",
                role: user_constant_1.USER_ROLE.ADMIN,
                email: config_1.default.admin_email,
                password: config_1.default.admin_password,
                mobileNumber: config_1.default.admin_mobile_number,
                status: user_constant_1.USER_STATUS.ACTIVE,
                profilePhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                bio: "",
                dateOfBirth: "",
                gender: "",
                maritalStatus: "",
                education: [],
                socialMedia: [],
                nickName: (0, generateNickname_1.generateNickname)("Admin")
            });
            console.log("Admin created successfully...");
            console.log("Seeding completed...");
        }
    }
    catch (error) {
        console.log("Error in seeding", error);
    }
});
exports.seed = seed;
