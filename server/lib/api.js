"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const payments_1 = require("./payments");
const checkout_1 = require("./checkout");
const webhooks_1 = require("./webhooks");
const firebase_1 = require("./firebase");
exports.app = express_1.default();
//* set rawbody for webhook handling
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
const cors_1 = tslib_1.__importDefault(require("cors"));
const customers_1 = require("./customers");
const billing_1 = require("./billing");
exports.app.use(cors_1.default({ origin: true }));
exports.app.post('/checkouts', runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
exports.app.post('/payments', runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
exports.app.post('/hooks', runAsync(webhooks_1.handleStripeWebhook));
// save a card on the customer record with a setupIntent
exports.app.post('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const setupIntent = await customers_1.createSetupIntent(user.uid);
    res.send(setupIntent);
}));
// Retrieve all cards attached to a customer
exports.app.get('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const wallet = await customers_1.listPaymentMethod(user.uid);
    res.send(wallet.data);
}));
exports.app.post('/subscriptions', runAsync(async (req, res) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await billing_1.createSubscription(user.uid, plan, payment_method);
    res.send(subscription);
}));
exports.app.get('/subscriptions', runAsync(async (req, res) => {
    const user = validateUser(req);
    const subscriptions = await billing_1.listSubscriptions(user.uid);
    res.send(subscriptions.data);
}));
exports.app.get('/subscriptions/:id', runAsync(async (req, res) => {
    const user = validateUser(req);
    res.send(await billing_1.cancelSubscription(user.uid, req.params.id));
}));
// Decodes the Firebase JSON Web Token
exports.app.use(decodeJWT);
/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
/**
 * Throws an error if the currentUser does not exist on the request
 */
function validateUser(req) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error('You must be logged in to make this request. i.e Authroization: Bearer <token>');
    }
    return user;
}
//# sourceMappingURL=api.js.map