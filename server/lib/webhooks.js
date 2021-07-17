"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const _1 = require(".");
const firebase_1 = require("./firebase");
const firebase_admin_1 = require("firebase-admin");
/**
 * Business logic for specific webhook event types, probably database update and confirmation send
 */
const webhookHandlers = {
    'payment_intent.succeeded': async (data) => {
        // Add business logic
    },
    'payment_intent.payment_failed': async (data) => {
        // Add business logic
    },
    'invoice.payment_failed': async (data) => {
        const customer = (await _1.stripe.customers.retrieve(data.customer));
        const userSnapshot = await firebase_1.db
            .collection('users')
            .doc(customer.metadata.firebaseUID)
            .get();
        await userSnapshot.ref.update({ status: 'PAST_DUE' });
    },
    'customer.subscription.created': async (data) => {
        const customer = (await _1.stripe.customers.retrieve(data.customer));
        const userId = customer.metadata.firebaseUID;
        const userRef = firebase_1.db.collection('users').doc(userId);
        await userRef.update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(data.id),
        });
    },
};
//* Validate the stripe webhook secret, then call the handler for the event type
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = _1.stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
    try {
        await webhookHandlers[event.type](event.data.object);
        res.send({ received: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
//# sourceMappingURL=webhooks.js.map