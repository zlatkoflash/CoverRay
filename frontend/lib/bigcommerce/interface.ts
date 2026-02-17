export interface BigCommerceProduct {
  entityId: number;
  name: string;
  sku: string;
  path: string;
  defaultImage?: {
    url: string;
    altText: string;
  };
  prices: {
    price: {
      value: number;
      currencyCode: string;
    };
  };
}

export interface BigCommerceGraphQLResponse {
  data: {
    site: {
      products: {
        edges: {
          node: BigCommerceProduct;
        }[];
      };
    };
  };
  errors?: any[];
}
