"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var currentUser = function (req, res, next) {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        //if jwt not defined rmove onto next middleware in our chain
        return next();
    }
    //decode / extract data out of jwt using verify()
    //! used after JWT_KEY - tell ts not to check if property defined - we already checked
    //in index.ts...
    try {
        //verify() will throw an error if token invalid
        var payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        //we want to add a new property (currentUser) to req...
        req.currentUser = payload;
    }
    catch (err) { }
    next();
};
exports.currentUser = currentUser;
