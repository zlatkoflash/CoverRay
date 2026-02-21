import ZSelectDropdown from "@/components/inputs/ZSelectDropdown";
import { editorSlice } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DropdownWithClientDrafts() {

  const [selectedDraft, setSelectedDraft] = useState<string>("");

  const templatesState = useSelector((state: RootState) => state.template);
  const clientDrafts = templatesState.clientDrafts;
  if (clientDrafts.length === 0) {
    return null;
  }

  const dispatch = useDispatch();

  const options = clientDrafts.map((draft) => ({
    value: draft.id,
    label: new Date(draft.updated_at).toLocaleString(),
  }));
  options.unshift({
    value: "",
    label: "Select a draft",
  });

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