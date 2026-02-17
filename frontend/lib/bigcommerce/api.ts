"use server";

import { IBCCartItem, IBigCommerceCart } from '@/utils/interfacesBigCommerce';
import { cookies } from 'next/headers';


async function fetchBC(
  endpoint: string,
  options: RequestInit = {},
  type: "v3" | "v2" = "v3"
) {
  const response = await fetch(`${type === "v3" ? process.env.BIGCOMMERCE_API_PATH : process.env.BIGCOMMERCE_API_PATH_V2
    }${endpoint}`, {
    ...options,
    headers: {
      'X-Auth-Token': process.env.BIGCOMMERCE_CLIENT_ACCESS_TOKEN as string,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`BC API Error [${response.status}]:`, errorBody);

    throw new Error(`BigCommerce API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Updated fetch products using the helper
 */
/*export async function BC_getProductsFromRest() {
  const result = await fetchBC('/catalog/products', {
    method: 'GET',
    next: { revalidate: 60 }
  });

  // Filter the data so we only send what the client needs
  // This prevents accidentally leaking sensitive store data
  return result.data.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    sku: product.sku,
    // Add only the fields your checkboxes and list need
  }));
}*/
/*export async function BC_getProductsFromRest() {
  // Adding limit=250 to get as many as possible in one request
  const result = await fetchBC('/catalog/products?limit=250', {
    method: 'GET',
    next: { revalidate: 60 }
  });

  // If there's no data, return an empty array to prevent crashes
  if (!result || !result.data) {
    return [];
  }

  // Returning the raw data array gives you every field: 
  // categories, images, variants, custom_fields, etc.
  return result.data;
}*/
export async function BC_getProductsFromRest() {
  // 1. Fetch the products (up to 250)
  const productResult = await fetchBC('/catalog/products?limit=250', {
    method: 'GET',
    next: { revalidate: 60 }
  });

  if (!productResult || !productResult.data || productResult.data.length === 0) {
    return [];
  }

  const products = productResult.data;

  // 2. Extract all Product IDs to fetch their variants in one go
  const productIds = products.map((p: any) => p.id).join(',');

  try {
    // 3. Fetch all variants for these specific products
    // We use the :in operator to filter by multiple IDs
    const variantResult = await fetchBC(`/catalog/variants?product_id:in=${productIds}&limit=250`, {
      method: 'GET',
      next: { revalidate: 60 }
    });

    const allVariants = variantResult?.data || [];

    // 4. Map the variants back into their respective products
    return products.map((product: any) => ({
      ...product,
      // Create the variants array that the standard endpoint missed
      variants: allVariants.filter((v: any) => v.product_id === product.id)
    }));

  } catch (error) {
    console.error("Error fetching variants in bulk:", error);
    // Return products with empty variants array so the UI doesn't crash
    return products.map((p: any) => ({ ...p, variants: [] }));
  }
}


/**
 * Adds a product and specific variant to the cart. 
 * If the existing cartId is invalid (404), it clears the cookie.
 */
export async function BC_addToCart(productId: number, quantity: number, variantId?: number) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get('bc_cartId')?.value;

  // Construct the item object
  // If variantId is provided, BigCommerce uses that to identify the specific option
  const lineItem = {
    quantity,
    product_id: productId,
    ...(variantId && { variant_id: variantId })
  };

  console.log("Add to Cart - ID:", cartId, "Item:", lineItem);

  try {
    let result;
    if (!cartId) {
      // --- SCENARIO 1: CREATE NEW ---
      result = await fetchBC('/carts', {
        method: 'POST',
        body: JSON.stringify({
          line_items: [lineItem],
          channel_id: 1, // Default channel
        }),
      });

      const newCartId = result.data.id;
      cookieStore.set('bc_cartId', newCartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      return { success: true, cart: result.data };
    } else {
      // --- SCENARIO 2: ADD TO EXISTING ---
      result = await fetchBC(`/carts/${cartId}/items`, {
        method: 'POST',
        body: JSON.stringify({
          line_items: [lineItem],
        }),
      });

      return { success: true, cart: result.data };
    }
  } catch (error: any) {
    console.error("Error adding to cart:", error);

    // If 404, the cartId in the cookie is stale/expired
    if (error?.status === 404 || error?.message?.includes("404")) {
      cookieStore.delete('bc_cartId');
      return { success: false, error: "Session expired. Please try again." };
    }

    // If 422, it usually means a variant_id was required but missing or invalid
    if (error?.status === 422) {
      return { success: false, error: "Please select a valid product option." };
    }

    return { success: false, error: "Failed to update cart" };
  }
}

/**
 * Removes a specific line item.
 * If the last item is removed, BC deletes the cart. We then clear the cookie.
 */
export async function BC_removeFromCart(itemId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('bc_cartId')?.value;

  if (!cartId) {
    return { success: false, error: "No active session found" };
  }

  try {
    const result = await fetchBC(`/carts/${cartId}/items/${itemId}`, {
      method: 'DELETE',
    });

    // BigCommerce returns 204 (null result) when the last item is deleted
    // or if the cart itself is deleted as a result.
    if (!result || !result.data) {
      cookieStore.delete('bc_cartId');
      return { success: true, cartDeleted: true, cart: null };
    }

    return { success: true, cart: result.data };
  } catch (error: any) {
    console.error("Error removing item:", error);

    // If we try to delete from a cart that BigCommerce already deleted (404)
    if (error?.status === 404 || error?.message?.includes("404")) {
      cookieStore.delete('bc_cartId');
      return { success: true, cartDeleted: true, cart: null };
    }

    return { success: false, error: "Failed to remove item" };
  }
}


/**
 * Fetches the current cart from BigCommerce using the cartId stored in cookies.
 */
export async function BC_getCart(): Promise<IBigCommerceCart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('bc_cartId')?.value;

  console.log("cartId on loading", cartId);

  if (!cartId) {
    return null; // No cart exists yet
  }

  try {
    // We include 'redirect_urls' so we can get the checkout link
    const result = await fetchBC(`/carts/${cartId}?include=redirect_urls`);

    // Safety check: if the API returns data, return it
    if (result && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching cart:", error);

    // If the cart is not found (404), it likely expired on the server.
    // We should clear our local cookie so we don't keep trying to fetch it.
    if (error instanceof Error && error.message.includes("404")) {
      cookieStore.delete('bc_cartId');
    }

    return null;
  }
}


/**
 * Fetches specific variants by an array of Variant IDs.
 * Useful for "hydrating" cart items with human-readable labels (Size, Color, etc.)
 */
export async function BC_getVariantsByIds(variantIds: number[]) {
  if (!variantIds || variantIds.length === 0) {
    return [];
  }

  // Join IDs into a comma-separated string (e.g., "211,212,213")
  const idQuery = variantIds.join(',');

  try {
    const result = await fetchBC(`/catalog/variants?id:in=${idQuery}`, {
      method: 'GET',
      next: { revalidate: 60 }
    });

    // Returns an array of variants, each containing 'option_values'
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching variant batch:", error);
    return [];
  }
}



/**
 * Gets a user by email. If the user doesn't exist, it creates a new one.
 */
export async function BC_GetOrCreateUserByEmail(email: string, firstName: string = "Guest", lastName: string = "User") {
  try {
    // 1. Try to find the customer by email
    // We use email:in which works for searching a single email as well
    const searchResult = await fetchBC(`/customers?email:in=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    // 2. If customer exists, return the first match
    if (searchResult && searchResult.data && searchResult.data.length > 0) {
      console.log("Customer found:", searchResult.data[0].id);
      return { success: true, customer: searchResult.data[0], wasCreated: false };
    }

    // 3. If customer doesn't exist, create a new one
    console.log("Customer not found. Creating new account for:", email);

    const createResult = await fetchBC('/customers', {
      method: 'POST',
      body: JSON.stringify([
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          authentication: {
            // Since a password is required via API, we set a temporary one
            // and force a reset so the user can choose their own via email.
            new_password: Math.random().toString(36).slice(-12) + "!",
            force_password_reset: true
          }
        }
      ]),
    });

    // v3 POST /customers returns an array of created customers
    if (createResult && createResult.data && createResult.data.length > 0) {
      return { success: true, customer: createResult.data[0], wasCreated: true };
    }

    throw new Error("Failed to create customer record.");

  } catch (error: any) {
    console.error("Error in BC_GetOrCreateUserByEmail:", error);
    return { success: false, error: error.message || "Failed to process customer request" };
  }
}





/**
 * Completes an order based on an existing cart with Billing and Shipping info.
 */
export async function BC_CompleteOrderFromCart(cartId: string,
  customer_id: number,
  addressDetails: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
  }) {
  try {
    // 1. Get the Checkout data to ensure we have current items
    const checkout = await fetchBC(`/checkouts/${cartId}?include=consignments,billing_address`);

    if (!checkout || !checkout.data) {
      throw new Error("Could not find checkout session for this cart.");
    }

    const bcCart = await BC_getCart();
    const allItems = [...bcCart?.line_items.digital_items as IBCCartItem[], ...bcCart?.line_items.physical_items as IBCCartItem[]];

    // 2. Create the Order
    const orderPayload = {
      // customer_id: checkout.data.cart.customer_id || 0,
      customer_id: customer_id,
      status_id: 10, // Completed
      billing_address: {
        first_name: addressDetails.firstName,
        last_name: addressDetails.lastName,
        street_1: addressDetails.address1,
        city: addressDetails.city,
        state: addressDetails.state,
        zip: addressDetails.zip,
        country: addressDetails.country,
        email: addressDetails.email,
      },
      // Shipping addresses must be an array of objects
      shipping_addresses: [
        {
          first_name: addressDetails.firstName,
          last_name: addressDetails.lastName,
          street_1: addressDetails.address1,
          city: addressDetails.city,
          state: addressDetails.state,
          zip: addressDetails.zip,
          country: addressDetails.country,
        }
      ],


      // "products":[{"name":"BigCommerce Coffee Mug","quantity":1,"price_inc_tax":50,"price_ex_tax":45}]

      products: allItems.map((item: IBCCartItem) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variant_id: item.variant_id,
      })),
    };

    // Note: If your fetchBC prepends /v3, ensure you handle the v2 /orders path
    console.log("Order Payload:", orderPayload);
    const orderResult = await fetchBC('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }, "v2");

    if (orderResult && orderResult.id) {
      // 3. Cleanup: Delete the cart and cookie
      const cookieStore = await cookies();

      // We wrap the delete in a try/catch because sometimes 
      // BC deletes the cart automatically upon order creation
      try {
        await fetchBC(`/carts/${cartId}`, { method: 'DELETE' });
      } catch (e) {
        console.log("Cart already cleared by BigCommerce");
      }

      cookieStore.delete('bc_cartId');

      return { success: true, orderId: orderResult.id };
    }

    throw new Error("Order creation failed.");
  } catch (error: any) {
    console.error("Error completing order:", error);
    return { success: false, error: error.message || "Failed to complete order" };
  }
}