"use client";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import Header from "./Header";
import HeaderAdministrator from "./HeaderAdministrator";

export default function HeaderWrap() {

  const authState = useSelector((state: RootState) => state.auth);

  console.log("HeaderWrap authState.user:", authState.user);

  if (authState.user !== null && authState.user?.user_metadata.role === "administrator") {
    return <HeaderAdministrator />;
  }

  return <Header />;
}