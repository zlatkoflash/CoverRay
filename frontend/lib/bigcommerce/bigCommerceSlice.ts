import { IBCProductVariation, IBigCommerceCart, IBigCommerceProduct } from "@/utils/interfacesBigCommerce";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BC_getCart, BC_getProductsFromRest, BC_getVariantsByIds } from "./api";

export interface IBigCommerceState {
  cart: IBigCommerceCart | null;
  cartVariants: IBCProductVariation[];
  products: IBigCommerceProduct[];
}

const initialState: IBigCommerceState = {
  cart: null,
  products: [],
  cartVariants: [],
}

export const bigCommerceSlice = createSlice({
  name: "bigCommerce",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<IBigCommerceCart | null>) => {
      state.cart = action.payload;
    },
    setProducts: (state, action: PayloadAction<IBigCommerceProduct[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoadBCCart.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
      state.cartVariants = action.payload.cartVariants;
    });
    builder.addCase(LoadBCCart.rejected, (state, action) => {
      state.cart = null;
    });
    builder.addCase(LoadBCProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(LoadBCProducts.rejected, (state, action) => {
      state.products = [];
    });
  }
});

export const bigCommerceActions = bigCommerceSlice.actions;
export default bigCommerceSlice.reducer;



export const LoadBCCart = createAsyncThunk(
  'bigCommerce/loadCart',
  async () => {
    /*const data = await getApiData<IBigCommerceCart>("/bigcommerce/cart", "GET", {}, "not-authorize", "application/json");
    return data;*/

    const cart = await BC_getCart();
    console.log("big commerce cart:", cart);
    // 1. Get the IDs from the cart object you just fetched

    const variantIds = cart !== null ? cart.line_items.physical_items.map((item: any) => item.variant_id) : [];

    // 2. Fetch all those variants at once using your new server action
    const variantData = await BC_getVariantsByIds(variantIds);
    console.log("variantData:", variantData);
    return {
      cart,
      cartVariants: variantData
    };

  }
);
export const LoadBCProducts = createAsyncThunk(
  'bigCommerce/loadProducts',
  async () => {
    /*const data = await getApiData<IBigCommerceProduct[]>("/bigcommerce/products", "GET", {}, "not-authorize", "application/json");
    return data;*/

    const products = await BC_getProductsFromRest();
    console.log("big commerce products:", products);
    return products;
  }
);