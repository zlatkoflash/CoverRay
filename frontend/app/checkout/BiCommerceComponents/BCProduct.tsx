"use client";

import ZSelectDropdown from "@/components/inputs/ZSelectDropdown";
import { BC_addToCart } from "@/lib/bigcommerce/api";
import { LoadBCCart } from "@/lib/bigcommerce/bigCommerceSlice";
import { AppDispatch } from "@/lib/store";
import { IBCProductVariation, IBigCommerceProduct } from "@/utils/interfacesBigCommerce";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";




export default function BCProduct({ product, type = "default-product" }: { product: IBigCommerceProduct, type?: "default-product" | "gift-product" }) {


  const [selectedVariant, setSelectedVariant] = useState<IBCProductVariation | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const getVariant = (): IBCProductVariation => {
    return selectedVariant && selectedVariant.price ? selectedVariant : product.variants[0];
  }


  const getCurrentPrice = () => {
    return selectedVariant && selectedVariant.price ? selectedVariant.price : product.price;
  }


  console.log("Product inside product button:", product);
  console.log("product.variants:", product.variants);

  const addToCart = async () => {
    const variantId = selectedVariant ? selectedVariant.id : product.variants[0].id;
    console.log("product:", product);
    console.log("variantId:", variantId);
    console.log("product.id:", product.id);
    setAddingToCart(true);
    const result = await BC_addToCart(product.id, 1, variantId as number);
    if (result?.success && result.cart) {
      // syncCartWithState(result.cart);
      dispatch(LoadBCCart())
    }
    setAddingToCart(false);
  }

  const productVariants = () => {
    return product.variants.length > 1 && <div className="product-variation" style={{
      minWidth: '15rem',
      marginTop: '.5rem'
    }}>
      <ZSelectDropdown
        dropdownStyle="for-forms"
        options={product.variants.map((option) => ({
          value: option.id.toString(),
          label: option.option_values?.map((optionValue) => optionValue.label).join(", ") || option.sku,
        }))}
        // value={product.base_variant_id?.toString()}
        selectedValue={selectedVariant ? selectedVariant.id.toString() : product.base_variant_id?.toString() as string}
        onSelect={(value: string) => {
          // product.base_variant_id = parseInt(value);
          setSelectedVariant(
            product.variants.find((variant) => variant.id === parseInt(value)) as IBCProductVariation
          );
        }}
      />
    </div>
  }


  if (type === "gift-product") {
    return (
      <>
        <div
          key={product.id}
          style={{
            cursor: 'default'
          }}
          className={`accessory-card ${
            // cartProductsItems.some((item) => item.id === product.id) 
            true ? 'selected-' : ''}`}
          onClick={() => {
            /*if (cartProductsItems.some((item) => item.id === product.id)) {
              dispatch(shopActions.removeProductFromCard(product.id));
            } else {
              dispatch(shopActions.addProductToCard(product));
            }*/
          }}
        >
          {
            /*<div className={`accessory-checkbox ${
            // cartProductsItems.some((item) => item.id === product.id) 
            true ? 'checked-' : ''}`}></div>*/
          }
          <div className="accessory-icon">{
            // product.metadata.icon
            // '[Icon]'
          }
            {
              getVariant().image_url !== "" && <Image
                width={100}
                height={100}
                src={getVariant().image_url}
                alt={product.name}
                style={{
                  borderRadius: ".5rem"
                }}
              />
            }

          </div>
          <div className="accessory-name">{product.name}</div>
          <div className="accessory-price">${getCurrentPrice().toFixed(2)}</div>
          {
            productVariants()
          }
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '.5rem', opacity: addingToCart ? 0.5 : 1, pointerEvents: addingToCart ? 'none' : 'auto', cursor: addingToCart ? 'default' : 'pointer' }}>
            <button type="button" className="add-qty-btn" onClick={() => {
              addToCart();
            }}>
              {addingToCart ? "Adding to cart..." : "+ Add"}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <div
        key={product.id}
        style={{
          cursor: 'default'
        }}
        className={`product-card ${
          // cartProductsItems.some((item) => item.id === product.id) 
          true ? 'selected-' : ''}`}
        onClick={() => {
          // toggleSelection(product.id);
          /*if (cartProductsItems.some((item) => item.id === product.id)) {
            dispatch(shopActions.removeProductFromCard(product.id));
          } else {
            dispatch(shopActions.addProductToCard(product));
          }*/
        }}
      >
        {
          /*<div className={`product-radio ${
          // cartProductsItems.some((item) => item.id === product.id) 
          true ? 'checked-' : ''}`} style={{
            borderRadius: "0px"
          }}></div>
        <div className="product-icon">{
          // product.metadata.icon
          "[Icon]"
        }</div>*/
        }
        <div className="product-info">
          <div className="product-name">
            {product.name}
            {
              // product.badge && <span className={`${product.badge.toLowerCase()}-badge`}>{product.badge}</span>
              // <span className={`undefined-badge`}>{'undefined-badge'}</span>
            }
          </div>
          <div className="product-desc" dangerouslySetInnerHTML={{ __html: product.description }} />
          {
            productVariants()
          }
        </div>
        <div>
          <div className="product-price" style={{
            textAlign: "right"
          }}>${
              // (product.default_price.unit_amount / 100).toFixed(2)
              (getCurrentPrice()).toFixed(2)
            }</div>
          <button type="button" className="add-qty-btn" style={{ opacity: addingToCart ? 0.5 : 1, pointerEvents: addingToCart ? 'none' : 'auto', cursor: addingToCart ? 'default' : 'pointer' }} onClick={() => {

            addToCart();
          }}>
            {addingToCart ? "Adding to cart..." : "+ Add"}
          </button>
        </div>
      </div>

    </>
  );
}