"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env_found = dotenv_1.default.config();
if (env_found.error) {
    throw new Error('no .env file found');
}
exports.default = {
    app: {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        the_movie_db_api_key: process.env.TMDB_API_KEY
    },
    db: {
        host: process.env.MYSQL_HOST,
        schema: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        pass: process.env.MYSQL_PASS
    }
};
//# sourceMappingURL=index.js.map