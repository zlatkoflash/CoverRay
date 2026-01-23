import Stripe from 'https://esm.sh/stripe@14?target=denonext';
import { IStripeProduct } from '../InterfacesStripe.ts';

export class ZStripe {

  private stripe: Stripe;

  constructor() {
    const apiKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!apiKey) throw new Error('Missing STRIPE_SECRET_KEY');

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16', // Or latest
      httpClient: Stripe.createFetchHttpClient(), // Required for Deno/Edge
    });
  }

  public async getProducts(): Promise<{ main_products: IStripeProduct[], frames_products: IStripeProduct[], unique_gifts_products: IStripeProduct[], standard_shipping_for_gifts: IStripeProduct[] }> {

    /*const main_products = await this.stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });*/
    const main_products = await this.getProductsByGroup('main-products');
    const frames_products = await this.getProductsByGroup('frames');
    const unique_gifts_products = await this.getProductsByGroup('unique-gift');

    const standard_shipping_for_gifts = await this.getProductsByGroup('standard-shipping-for-gift');

    const dataProducts = {
      main_products,
      frames_products,
      unique_gifts_products,
      standard_shipping_for_gifts
    };

    console.log(dataProducts);

    return dataProducts;


    /*return products.data.map((product) => {
      const price = product.default_price as Stripe.Price;
      return {
        id: product.id,
        name: product.name,
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        priceId: price.id,
        originalPrice: product.metadata.compare_at_price ? parseFloat(product.metadata.compare_at_price) : null,
        requiresShipping: product.metadata.requires_shipping === 'true',
      };
    });*/
  }

  public async getProductsByGroup(group: string): Promise<IStripeProduct[]> {
    const response = await this.stripe.products.search({
      query: `metadata['group']:'${group}' AND active:'true'`,
      expand: ['data.default_price'],
    });

    const products = response.data.sort((a: IStripeProduct, b: IStripeProduct) => a.default_price.unit_amount - b.default_price.unit_amount);

    return products;
  }


  public async getStripeCustomer(email: string): Promise<Stripe.Customer | null> {

    let emailFor = email;
    emailFor = "zlatkoflash666@gmail.com"; // debugging

    const response = await this.stripe.customers.search({
      query: `email:'${emailFor}'`,
    });

    if (response.data.length === 0) {
      // create customer
      const customer = await this.stripe.customers.create({
        email: emailFor
      });
      console.log("Customer is created:", customer);
      return customer;
    }

    return response.data.length > 0 ? response.data[0] : null;
  }

  public async getProductsBYIds(ids: string[]) {
    // Use the 'ids' parameter to fetch multiple products at once
    const products = await this.stripe.products.list({
      ids: ids,
      // This tells Stripe: "Don't just give me the ID, give me the whole object"
      expand: ['data.default_price']
    });

    return products.data; // This is your array of IStripeProduct objects
  }

  public async doPaymentIntent(payload: {
    amount100: number,
    customerId: string,
    paymentMethodId: string,
    productsIds: string[]
  }) {

    const productsSelected = await this.getProductsBYIds(payload.productsIds);
    console.log("productsSelected:", productsSelected);
    const productsSummary = productsSelected.map((p: IStripeProduct) => `${p.name} ($${p.default_price.unit_amount / 100})`).join(' | ');
    const productsSummaryTotalAmount100 = productsSelected.reduce((acc: number, p: IStripeProduct) => acc + (p.default_price.unit_amount), 0);

    /**
     * Now we check if total amount is equal of the amount of the payment intent
     */
    if (Math.round(productsSummaryTotalAmount100) !== Math.round(payload.amount100)) {
      return {
        error: true,
        message: "The total amount of the products does not match the amount of the payment intent."
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(payload.amount100),                      // $50.00 in cents
      currency: 'usd',
      customer: payload.customerId,          // Your IStripeCustomer ID
      payment_method: payload.paymentMethodId,    // Your IStripePaymentMethod ID

      // THIS IS THE MAGIC LINE:
      // It attaches the card to the customer once the payment succeeds.
      setup_future_usage: 'off_session',

      confirm: true,                     // Try to charge the card immediately
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },


      metadata: {
        product_ids: payload.productsIds.join(','),
        // order_summary: payload.items.map(i => `${i.title} ($${i.price})`).join(' | '),
        productsSummary: productsSummary,
        total_items: payload.productsIds.length.toString()
      }

    });
    return paymentIntent;
  }

}