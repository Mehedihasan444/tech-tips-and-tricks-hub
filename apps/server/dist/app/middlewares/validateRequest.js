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
exports.validateRequestCookies = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const validateRequest = (schema) => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedBody = yield schema.parseAsync({
            body: req.body,
        });
        req.body = parsedBody.body;
        next();
    }));
};
const validateRequestCookies = (schema) => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedCookies = yield schema.parseAsync({
            cookies: req.cookies,
        });
        req.cookies = parsedCookies.cookies;
        next();
    }));
};
exports.validateRequestCookies = validateRequestCookies;
exports.default = validateRequest;
