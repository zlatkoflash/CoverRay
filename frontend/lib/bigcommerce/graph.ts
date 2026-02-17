"use server";

import { BigCommerceGraphQLResponse, BigCommerceProduct } from "./interface";

const GET_PRODUCTS_QUERY = `
  query getProducts($limit: Int) {
    site {
      products(first: $limit) {
        edges {
          node {
            entityId
            name
            sku
            path
            defaultImage {
              url(width: 500)
              altText
            }
            prices {
              price {
                value
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

// still not working need to fix the things with the token
export async function fetchBigCommerceProducts(limit: number = 10): Promise<BigCommerceProduct[]> {

  console.log("BIGCOMMERCE_STORE_HASH", process.env.BIGCOMMERCE_STORE_HASH);
  console.log("BIGCOMMERCE_STOREFRONT_TOKEN", process.env.BIGCOMMERCE_STOREFRONT_TOKEN);

  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
  const storefrontToken = process.env.BIGCOMMERCE_STORE_TOKEN;

  const response = await fetch(`https://store-${storeHash}.mybigcommerce.com/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${storefrontToken}`,
    },
    body: JSON.stringify({
      query: GET_PRODUCTS_QUERY,
      variables: { limit },
    }),
    next: { revalidate: 3600 } // Next.js 15+ Cache revalidation
  });

  const result: BigCommerceGraphQLResponse = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error('Failed to fetch BigCommerce products');
  }

  // Flatten the response from "edges/node" to a simple array
  return result.data.site.products.edges.map(edge => edge.node);
}