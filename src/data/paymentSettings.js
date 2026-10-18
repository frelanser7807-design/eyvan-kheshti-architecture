// Public PayPal-hosted payment URL only. Never put credentials or card data here.
// Keep disabled until the owner provides the actual receiving-account payment link.
export const paymentSettings = {
  enabled: false,
  paypalHostedLink: '',
};

export const paymentPage = {
  title: 'Payments | World Arch Journal',
  heading: 'Pay for your project.',
  description: 'Continue to secure PayPal checkout for an agreed architecture or interior design payment. Available card and PayPal options are shown at checkout.',
  intro: 'A simple place to settle an agreed design fee or project invoice. Review your payment details, then continue to PayPal to choose an available payment method.',
  steps: [
    ['Review your invoice', 'Check the agreed scope, amount, currency and project reference before making a payment.'],
    ['Choose how to pay', 'PayPal displays the payment methods available for your country and transaction, which may include a credit or debit card.'],
    ['Keep your receipt', 'Save your PayPal payment confirmation and include your invoice reference when contacting the studio.'],
  ],
};
