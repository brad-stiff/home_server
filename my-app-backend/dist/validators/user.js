"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = validateRegister;
function validateRegister(body) {
    const errors = [];
    if (!body || typeof body !== 'object') {
        return { errors: ['Invalid request body'] };
    }
    const { email, password } = body;
    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }
    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    }
    else if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (errors.length > 0) {
        return { errors };
    }
    return { data: { email, password } };
}
//# sourceMappingURL=user.js.map