import { IStripeProduct } from "@/utils/interfacesStripe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IShopState {
  products: {
    main_products: IStripeProduct[];
    frames_products: IStripeProduct[];
    unique_gifts_products: IStripeProduct[];
    standard_shipping_for_gifts: IStripeProduct[];
  },

  cardProductsItems: IStripeProduct[];
  selectedStandardShipForGifts: IStripeProduct | null;

  showModalCardPayment: boolean;

  paymentProcessingStatus: "idle" | "processing" | "success" | "error";
  paymentProcessingMessage: string;
}

const initialState: IShopState = {
  products: {
    main_products: [],
    frames_products: [],
    unique_gifts_products: [],
    standard_shipping_for_gifts: [],
  },
  cardProductsItems: [],
  selectedStandardShipForGifts: null,

  showModalCardPayment: false,
  // showModalCardPayment: true, // for debugging

  paymentProcessingStatus: "idle",
  paymentProcessingMessage: "",
};

export const shopSlice = createSlice({
  name: "shop",
  initialState: initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IShopState['products']>) => {
      state.products = action.payload;
    },

    addProductToCard: (state, action: PayloadAction<IStripeProduct>) => {
      state.cardProductsItems.push(action.payload);
    },

    removeProductFromCard: (state, action: PayloadAction<string>) => {
      state.cardProductsItems = state.cardProductsItems.filter((item) => item.id !== action.payload);
    },

    clearCardProductsItems: (state) => {
      state.cardProductsItems = [];
    },

    setSelectedStandardShipForGifts: (state, action: PayloadAction<IStripeProduct>) => {
      state.selectedStandardShipForGifts = action.payload;
    },

    setShowModalCardPayment: (state, action: PayloadAction<boolean>) => {
      state.showModalCardPayment = action.payload;
    },

    setPaymentProcessingStatus: (state, action: PayloadAction<"idle" | "processing" | "success" | "error">) => {
      state.paymentProcessingStatus = action.payload;
    },

    setPaymentProcessingMessage: (state, action: PayloadAction<string>) => {
      state.paymentProcessingMessage = action.payload;
    },
  },
});

export const shopActions = shopSlice.actions;
export default shopSlice.reducer;


export const ShopTotal = (state: IShopState) => {
  const total = ShopSubTotal(state) + ShopTotalShipping(state);
  return total;
}
export const GetShippingProductForGiftProducts = (state: IShopState) => {
  const IhaveGiftProductInCart = state.cardProductsItems.some((item) => item.metadata.group === "unique-gift");
  return IhaveGiftProductInCart ? state.products.standard_shipping_for_gifts[0] : null;
}
export const ShopTotalShipping = (state: IShopState) => {
  const shippingProduct = GetShippingProductForGiftProducts(state);
  const total = shippingProduct ? shippingProduct.default_price.unit_amount / 100 : 0;
  return total;
}
export const ShopSubTotal = (state: IShopState) => {
  const subTotal = state.cardProductsItems.reduce((sum, item) => sum + item.default_price.unit_amount / 100, 0);
  return subTotal;
}
export const SavingTotal = (state: IShopState) => {
  // this maybe will need, but don't work good now.
  const total = state.cardProductsItems.reduce((sum, item) => sum + item.default_price.unit_amount / 100, 0);
  return total;
}
