"use client"

import { fetchCategories, fetchTemplates, templatesActions } from "@/lib/features/templates/templatesSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HomePageHydration() {

  const dispatch = useDispatch<AppDispatch>();
  const stateTempaltes = useSelector((state: RootState) => state.template);
  // const isHydrated = useRef(false);

  useEffect(() => {
    if (stateTempaltes.isEditorInitialHydrated) return;
    // isHydrated.current = true;
    dispatch(fetchCategories());
    dispatch(templatesActions.setIsEditorInitialHydrated(true));
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