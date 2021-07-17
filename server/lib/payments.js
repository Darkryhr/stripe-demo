"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const _1 = require(".");
async function createPaymentIntent(amount) {
    const paymentIntent = _1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
    });
    return paymentIntent;
}
exports.createPaymentIntent = createPaymentIntent;
//# sourceMappingURL=payments.js.map