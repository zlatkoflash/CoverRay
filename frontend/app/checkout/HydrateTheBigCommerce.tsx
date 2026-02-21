"use client"

import { bigCommerceActions, LoadBCCart, LoadBCProducts } from "@/lib/bigcommerce/bigCommerceSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HydrateTheBigCommerce() {

  const dispatch = useDispatch<AppDispatch>();
  const stateTemplate = useSelector((state: RootState) => state.template);

  const router = useRouter();



  useEffect(() => {
    if (stateTemplate.selectedTemplate === null) {
      router.push("/");
      // return null;
      return;
    }
    dispatch(LoadBCCart());
    dispatch(LoadBCProducts());

  }, []);

  return null;
}