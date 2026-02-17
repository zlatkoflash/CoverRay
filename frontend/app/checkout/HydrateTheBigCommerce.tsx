"use client"

import { bigCommerceActions, LoadBCCart, LoadBCProducts } from "@/lib/bigcommerce/bigCommerceSlice";
import { AppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function HydrateTheBigCommerce() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    dispatch(LoadBCCart());
    dispatch(LoadBCProducts());

  }, []);

  return null;
}