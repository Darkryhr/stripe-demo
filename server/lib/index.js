"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.config();
}
const stripe_1 = tslib_1.__importDefault(require("stripe"));
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: '2020-08-27',
});
const api_1 = require("./api");
const port = process.env.PORT || 3333;
api_1.app.listen(port, () => console.log(`API available on http://localhost:${port}`));
//# sourceMappingURL=index.js.map