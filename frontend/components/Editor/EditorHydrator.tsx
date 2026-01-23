"use client";

import * as EditorActions from "@/lib/features/editor/editorSlice";
import {
  templatesActions
} from "@/lib/features/templates/templatesSlice";
import { AppDispatch } from "@/lib/store";
import { LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import { ITemplate } from "@/utils/interfaceDatabase";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function EditorHydrator(
  { template }: { template: ITemplate }
) {

  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useRef(false);


  const ____LoadAndSetTemplate = async () => {
    if (isHydrated.current) return;

    const SavedTemplate = await LS_GetTemplateFromIndexDB(template.slug);

    console.log("SavedTemplate:", SavedTemplate);
    console.log("template.template_data:", template.template_data);

    dispatch(EditorActions.loadEditorImageSilent());
    if (SavedTemplate !== null) {
      // if we have saved template in localhost we load it
      dispatch(EditorActions.setItems(SavedTemplate.edited_template_items));
      dispatch(EditorActions.setImageUrl(SavedTemplate.coverImageURL));
    }
    else {
      // if we don't have saved template in localhost we load the template from the server
      dispatch(EditorActions.setItems(template.template_data.pages[0].children));
    }
    dispatch(templatesActions.setSelectedTemplate(template));

    isHydrated.current = true;
  }

  useEffect(() => {

    ____LoadAndSetTemplate();

  }, []);

  return null;
}