"use client"

import { fetchCategories, fetchTemplates, templatesActions } from "@/lib/features/templates/templatesSlice";
import { AppDispatch } from "@/lib/store";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function HomePageHydration() {

  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useRef(false);

  useEffect(() => {
    if (isHydrated.current) return;
    isHydrated.current = true;
    dispatch(fetchCategories());
    /**
     * When category is 0 it will load all templates
     */
    // no need for fetching templates, with fetchCategories i am fetching the parent categories,
    // subcategories for the first parent category and the templates for the subcategory
    // dispatch(fetchTemplates(0));
    dispatch(templatesActions.setContinueButtonDisabled(true));
  }, []);

  return null;
}