import ZSelectDropdown from "@/components/inputs/ZSelectDropdown";
import { editorSlice } from "@/lib/features/editor/editorSlice";
import { fetchClientDrafts, templatesActions } from "@/lib/features/templates/templatesSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DropdownWithClientDrafts() {

  const [selectedDraft, setSelectedDraft] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const templatesState = useSelector((state: RootState) => state.template);
  const clientDrafts = templatesState.clientDrafts;



  const options = clientDrafts.map((draft) => ({
    value: draft.id,
    label: new Date(draft.updated_at).toLocaleString(),
  }));
  options.unshift({
    value: "",
    label: "Select a draft",
  });

  useEffect(() => {
    console.log("clientDrafts", clientDrafts);
    if (clientDrafts.length > 0) {
      setSelectedDraft(clientDrafts[0].id);
    }
  }, [clientDrafts]);

  useEffect(() => {
    console.log("selectedDraft", selectedDraft);

    /*dispatch(templatesActions.fetchClientDrafts({
      template_id: templatesState.selectedTemplate?.id || "",
      // user_id: ""
    }));*/

    if (templatesState.selectedTemplate === null) return;

    dispatch(fetchClientDrafts(
      {
        template_id: templatesState.selectedTemplate?.id || ""
      }
    )).unwrap().then((data) => {
      setSelectedDraft("");
    });

  }, [templatesState.selectedTemplate]);

  if (clientDrafts.length === 0) {
    return null;
  }
  return (
    <>
      <ZSelectDropdown
        dropdownStyle="for-forms"
        options={options}
        // value={""}
        onSelect={(value) => {
          setSelectedDraft(value);
          // load the draft data
          const draft = clientDrafts.find((draft) => draft.id === value);
          if (draft !== undefined) {
            // dispatch(templatesActions.setDraft(draft));
            dispatch(editorSlice.actions.setKonvaData(draft.template_data));
          }
          console.log(draft);
        }}
        selectedValue={selectedDraft}
      />
    </>
  )
}