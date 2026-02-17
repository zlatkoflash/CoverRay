"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { shopActions } from "@/lib/features/shop/shopSlice"; // Adjust path to your shopActions
import BCProduct from "../../BiCommerceComponents/BCProduct";

export default function BCMobileMainProducts() {
  const dispatch = useDispatch();

  // Data from Store
  const products = useSelector((state: RootState) => state.shop.products);
  const PRODUCTS = products.main_products || [];
  const cartProductsItems = useSelector((state: RootState) => state.shop.cardProductsItems);
  const bigCommerceState = useSelector((state: RootState) => state.bigCommerce);
  const bigCommerceProducts = bigCommerceState.products;

  const MagazineProducts = bigCommerceProducts.filter((product) => product.categories.includes(28));
  // const GiftsProducts = bigCommerceProducts.filter((product) => product.categories.includes(29));

  // const all

  const handleSelect = (product: any) => {
    // Because this is a "Required" Main Product section, 
    // we typically want to replace the existing main product with the new selection.

    // Step 1: Remove any other "Main Products" already in cart if necessary 
    // (Optional: depending on if your logic allows multiple main products)

    // Step 2: Add the selected product
    const isAlreadyInCart = cartProductsItems.some((item) => item.id === product.id);

    if (isAlreadyInCart) {
      dispatch(shopActions.removeProductFromCard(product.id));
    } else {
      dispatch(shopActions.addProductToCard(product));
    }
  };

  return (
    <div className="checkout-section">
      <div className="checkout-section-title">
        <span>Choose Your Product</span>
        <span className="required-badge">Required</span>
      </div>

      <div className="products-container">
        {MagazineProducts.map((product) => {
          return <BCProduct key={product.id} product={product} />
        })}
      </div>
    </div>
  );
}