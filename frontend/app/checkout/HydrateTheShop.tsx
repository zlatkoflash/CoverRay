"use client";

import { IShopState, shopActions } from "@/lib/features/shop/shopSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch } from "react-redux";

export default function HydrateTheShop({ shopState }: { shopState: IShopState }) {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(shopActions.setProducts(shopState.products));
  }, [shopState]);

  return null;
}