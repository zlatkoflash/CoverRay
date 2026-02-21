"use client";

import * as EditorActions from "@/lib/features/editor/editorSlice";
import {
  templatesActions
} from "@/lib/features/templates/templatesSlice";
import { AppDispatch } from "@/lib/store";
import { POSTER_H, POSTER_W } from "@/utils/editor";
import { LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import { ITemplate } from "@/utils/interfaceDatabase";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function EditorHydrator(
  { template }: { template: ITemplate }
) {

  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useRef(false);

  console.log("Template for hydration:", template);


  const ____LoadAndSetTemplate = async () => {

    // return;

    if (isHydrated.current) return;

    const SavedTemplate = await LS_GetTemplateFromIndexDB(template.slug);


    console.log("SavedTemplate:", SavedTemplate);
    console.log("template.template_data:", template.template_data);

    dispatch(EditorActions.loadEditorImageSilent());
    if (SavedTemplate !== null) {
      // if we have saved template in localhost we load it
      // dispatch(EditorActions.setItems(SavedTemplate.edited_template_items));
      dispatch(EditorActions.setKonvaData(SavedTemplate.konvaData));
      dispatch(EditorActions.setImageUrl(SavedTemplate.coverImageURL));
    }
    else {
      // if we don't have saved template in localhost we load the template from the server
      // dispatch(EditorActions.setItems(template.template_data.pages[0].children));
      let templatesData = template.template_data as IKonvaTemplate;
      // let templatesData = template.template_data_fixed as IKonvaTemplate;
      if (templatesData.pages === undefined) {
        templatesData = {
          pages: [{
            children: [],
            background: "#7b7b7b",
            bleed: 0,
            duration: 0,
            width: POSTER_W,
            height: POSTER_H,
            id: "page_1"
          }],
          // coverImageURL: "",
          audios: [],
          unit: "px",
          dpi: 72,
          width: POSTER_W,
          height: POSTER_H,

        };
      }
      dispatch(EditorActions.setKonvaData(templatesData));
    }
    dispatch(templatesActions.setSelectedTemplate(template));

    isHydrated.current = true;
  }

  useEffect(() => {

    ____LoadAndSetTemplate();

  }, []);

  useEffect(() => {
    // console.log("EditorHydrator :: template", template);
    return () => {
      console.log("EditorHydrator :: template", template);
      dispatch(EditorActions.resetEditor());
    }
  }, [dispatch]);

  return null;
}