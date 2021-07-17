import { stripe } from '.';

export async function createPaymentIntent(amount: number) {
  const paymentIntent = stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    // receipt_email
  });

  return paymentIntent;
}
