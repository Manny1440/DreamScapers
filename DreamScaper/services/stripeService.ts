
export const createCheckoutSession = async (userEmail: string): Promise<string> => {
  console.log(`Starting Stripe for ${userEmail}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return "https://checkout.stripe.com/simulated";
};

export const createBillingPortalSession = async (customerId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return "https://billing.stripe.com/simulated";
};
