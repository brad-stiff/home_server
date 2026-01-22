"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../../validators/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const router = (0, express_1.Router)();
// router.get('/') //get all users
// router.get('/:id') //get one
router.get('/user_levels', async (req, res) => {
    try {
        const user_levels = await db_1.default.user.getUserLevels();
        res.json(user_levels);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/register', async (req, res, next) => {
    try {
        const validation = (0, user_1.validateRegister)(req.body);
        if ('errors' in validation) {
            return res.status(400).json({ errors: validation.errors });
        }
        const { email, password } = validation.data;
        const existing_user = await db_1.default.user.getUsers({ email_search_str: email, exact_match: 1 });
        if (existing_user.length > 0) {
            return res.status(400).json({ errors: ['Email already in use'] });
        }
        //const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt_1.default.hash(password, 12); //salt); //can just write 12 instead of salt
        const new_user_request = {
            email,
            password_hash: hash
        };
        //await insert
        const response = await db_1.default.user.insertUser(new_user_request);
        //delete password
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
//what happens if already logged in?
router.post('/login', async (req, res, next) => {
    try {
        const validation = (0, user_1.validateRegister)(req.body);
        if ('errors' in validation) {
            return res.status(400).json({ errors: validation.errors });
        }
        const { email, password } = validation.data;
        const existing_user_password_hash = await db_1.default.user.getUserPasswordHash(email);
        if (existing_user_password_hash.length === 0) {
            return res.status(400).json({ errors: ['Cannot find user'] });
        }
        if (await bcrypt_1.default.compare(password, existing_user_password_hash[0].password_hash)) {
            const access_token = jsonwebtoken_1.default.sign({ email: email }, config_1.default.app.access_token_secret);
            return res.status(200).json({ messages: ['Success!', access_token] });
        }
        else {
            return res.status(400).json({ errors: ['Incorrect credentials'] });
        }
    }
    catch (error) {
        next(error);
    }
});
function authenticateToken(req, res, next) {
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];
}
exports.default = router;
//# sourceMappingURL=user.js.map