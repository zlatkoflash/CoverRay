"use client";

import ZSelectDropdown from "@/components/inputs/ZSelectDropdown";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { templatesActions } from "@/lib/features/templates/templatesSlice";
import { RootState } from "@/lib/store";
import { getApiData } from "@/utils/api";
import { ITemplateVersion } from "@/utils/interfaceDatabase";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DropdownWithTheVersions() {

  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.editor);

  const templateState = useSelector((state: RootState) => state.template);
  const templateId = templateState.selectedTemplate?.id;
  const versions = templateState.versions;
  const selectedVersion = templateState.selectedVersion;

  // const [templateDraftVersionOrPublic, set_templateDraftVersionOrPublic] = useState("live");
  // const [versions, setVersions] = useState<ITemplateVersion[]>([]);
  // editorState.selectedTemplateId
  // templateState.selectedTemplate.


  // const [draftTemplate, setDraftTemplate] = useState<any>(null);

  const LoadTemplateDraftVersionOrPublic = async () => {
    console.log("templateId:", templateId);
    const data = await getApiData<{
      ok: true,
      versions: ITemplateVersion[]
    }>("/administrator/get-template-versions", "POST", {
      template_id: templateId,
    }, "authorize");
    console.log("data after getting the versions:", data);
    if (data.ok === true) {
      dispatch(templatesActions.setVersions(data.versions));
    }
  }

  useEffect(() => {
    console.log("templateDraftVersionOrPublic:", selectedVersion, "template id:", templateId);
    LoadTemplateDraftVersionOrPublic();
  }, [templateId]);


  /**
   * This function will load the draft data, or live data or specific version data
   */
  const ___LoadTemplateVersionData = async () => {
    console.log("templateId:", templateId);
    const data = await getApiData<{
      ok: true,
      // versions: ITemplateVersion[]
      dataForKonva: IKonvaTemplate
    }>("/administrator/get-template-version-data", "POST", {
      template_id: templateId,
      version: selectedVersion
    }, "authorize");
    console.log("data after getting the versions:", data);
    if (data.ok === true && data.dataForKonva !== null) {
      // dispatch(templatesActions.setVersions(data.versions));
      dispatch(EditorActions.setKonvaData(data.dataForKonva));
    }
  }

  const isFirstRender = useRef(true)
  useEffect(() => {


    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("selecting version, templateId:", templateId);

    if (selectedVersion === "draft") {
      dispatch(templatesActions.setIsDraft(true))
    }
    else {
      dispatch(templatesActions.setIsDraft(false))
    }

    ___LoadTemplateVersionData();

  }, [selectedVersion]);

  return (
    <>
      <ZSelectDropdown
        dropdownStyle="for-forms"
        onSelect={(value) => {
          console.log("value:", value);
          dispatch(templatesActions.setSelectedVersion(
            value as "draft" | "live" | number
          ));
        }}
        options={[
          { value: "live", label: "Live Template" },
          { value: "draft", label: "Draft Template" },
          // { value: "version-1", label: "Version 1" },
          ...versions.map((version) => ({
            value: version.id.toString(),
            label: `Version ${new Date(version.created_at).toLocaleString()}`,
          })),
        ]}
        label="Select Version"
        selectedValue={selectedVersion as string}

      />
    </>
  );
}