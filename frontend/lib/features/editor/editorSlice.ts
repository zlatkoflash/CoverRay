import { LS_GetImageURL, LS_SaveImageIntoIndexDB } from '@/utils/editor-local-storage';
import { ITemplate } from '@/utils/interfaceDatabase';
import { IKonvaBaseCanvasItem, IKonvaTemplate, IKonvaTemplateImageItem, IKonvaTemplateTextItem } from '@/utils/interfaceTemplate';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Expanded types to handle multiple items
/*export interface CanvasItem {
  id: string; // Crucial for identifying which input matches which Konva text
  content: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  type: 'text' | 'image'; // Good to have for future-proofing
  fill: string;
  scaleX: number;
  scaleY: number;

  draggable: boolean;
  contentEditable: boolean;
}


export interface CanvasItemText extends CanvasItem {
  text: string;
  fontStyle: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffset: { x: number; y: number };
  shadowOpacity: number;
  stroke: string;
  strokeWidth: number;
  fontFamily: string;
}*/

interface HistorySnapshot {
  // items: CanvasItem[];
  items: IKonvaBaseCanvasItem[];
  imageUrl: string | null;
}

export interface IEditedTemplateForSave {
  // edited_template_items: CanvasItem[];
  // edited_template_items: IKonvaBaseCanvasItem[];
  // image_url: string;
  konvaData: IKonvaTemplate;
  templateDB: ITemplate;
  coverImageURL: string;
  thumbnailDataUrl: string | null;
}

interface EditorState {
  imageUrl: string | null;

  // we have slice for the template
  // selectedTemplateId: number | null;

  // Now we use an array to store everything coming from page.tsx
  // items: CanvasItem[];
  konvaData: IKonvaTemplate | null;

  isProcessing: boolean;
  statusMessage: string;
  status: 'loading' | 'idle' | 'succeeded' | 'failed';

  // selectedKonvaItem: CanvasItem | null;
  selectedKonvaItem: IKonvaBaseCanvasItem | null;

  view: {
    x: number;
    y: number;
    scale: number;
  },


  // Updated history to track both items and images
  history: {
    past: HistorySnapshot[];
    future: HistorySnapshot[];
  };

}

const initialState: EditorState = {
  imageUrl: null,
  // selectedTemplateId: null,
  // items: [], // Start empty, wait for page.tsx to fill it
  konvaData: /*{
    width: 0,
    height: 0,
    pages: [],
    audios: [],
    unit: "px",
    dpi: 0,
  }*/ null,
  isProcessing: false,
  statusMessage: "",
  status: 'idle',

  selectedKonvaItem: null,

  // ADD THIS:
  view: {
    x: 50,                // Initial horizontal offset
    y: 50,                // Initial vertical offset
    scale: 1,             // 1 = 100% zoom
  },

  history: {
    past: [],
    future: []
  },

};


// Helper to handle the history logic
const EditorRecordHistory = (state: EditorState) => {
  const snapshot = {
    // items: JSON.parse(JSON.stringify(state.items)),
    items: JSON.parse(JSON.stringify(state.konvaData?.pages[0].children)),
    imageUrl: state.imageUrl
  };

  // Re-assign a NEW array instead of just pushing
  // This forces Redux to recognize the change
  state.history.past = [...state.history.past, snapshot];

  // Clear future
  state.history.future = [];
  console.log("state.history:", state.history.past);

  // Limit history
  if (state.history.past.length > 50) {
    state.history.past = state.history.past.slice(1);
  }
};


/**
 * Global helper to sync the selection and controls after history changes.
 * 1. Finds the item in the new state that matches the previously selected ID.
 * 2. Updates the selection reference so side panels (controls) update.
 * 3. Clears selection if the item no longer exists.
 */
const syncSelectionAndControls = (state: any) => {
  if (!state.selectedKonvaItem) return;

  const currentId = state.selectedKonvaItem.id;

  // Find the version of this item in the newly restored items array
  const restoredItem = state.konvaData?.pages[0].children.find((item: any) => item.id === currentId);

  if (restoredItem) {
    // Update the selection with the data from the history snapshot
    // This triggers the useSelector in your TextSize/TextInput components
    state.selectedKonvaItem = { ...restoredItem };
    console.log(`Syncing controls for item: ${currentId}`);
  } else {
    // The item doesn't exist in this point of history (e.g., we undid its creation)
    state.selectedKonvaItem = null;
    console.log("Item no longer exists in this state. Deselecting.");
  }
};


export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // THIS IS THE ONE YOU CALL FROM PAGE.tsx WRAPPER
    /*setItems: (state, action: PayloadAction<CanvasItem[]>) => {
      state.items = action.payload;
    },*/
    /*setItems: (state, action: PayloadAction<IKonvaBaseCanvasItem[]>) => {
      if (state.konvaData) {
        state.konvaData.pages[0].children = action.payload;
      }
    },*/
    setKonvaData: (state, action: PayloadAction<IKonvaTemplate>) => {
      state.konvaData = action.payload;
    },

    setImageUrl: (state, action: PayloadAction<string | null>) => {
      // 1. Save current state to history BEFORE changing it
      EditorRecordHistory(state);

      state.imageUrl = action.payload;
      console.log("image new url A:", action.payload);
    },

    /*setTemplate: (state, action: PayloadAction<number>) => {
      state.selectedTemplateId = action.payload;
    },*/

    // Add this reducer
    setScale: (state, action) => {
      // Clamp zoom between 10% (0.1) and 300% (3.0)
      state.view.scale = Math.max(0.1, Math.min(3, action.payload));
    },

    setView: (state, action: PayloadAction<{ x: number; y: number; scale: number }>) => {
      state.view.x = action.payload.x;
      state.view.y = action.payload.y;
      state.view.scale = action.payload.scale;
    },

    /*moveItemByArrow: (state, action: PayloadAction<{ id: string, direction: 'up' | 'down' | 'left' | 'right', step: number }>) => {
      const item = state.konvaData?.pages[0].children.find(i => i.id === action.payload.id);
      if (item) {
        if (action.payload.direction === 'up') item.y -= action.payload.step;
        if (action.payload.direction === 'down') item.y += action.payload.step;
        if (action.payload.direction === 'left') item.x -= action.payload.step;
        if (action.payload.direction === 'right') item.x += action.payload.step;
      }
    },*/

    updateItem: (state, action: PayloadAction<{
      id: string;
      changes: Partial<

        // CanvasItem | CanvasItemText
        IKonvaBaseCanvasItem | IKonvaTemplateImageItem | IKonvaTemplateTextItem

      >,
      addToHistory?: boolean
    }>) => {
      const { id, changes, addToHistory = false } = action.payload;
      // const index = state.items.findIndex(item => item.id === id);
      const index = state.konvaData?.pages[0].children.findIndex(item => item.id === id);

      if (index !== -1) {

        if (addToHistory) {
          EditorRecordHistory(state);
        }

        // 1. Update the item in the list
        // state.items[index] = { ...state.items[index], ...changes };
        if (state.konvaData) {
          state.konvaData.pages[0].children[index as number] = { ...state.konvaData.pages[0].children[index as number], ...changes };
        }

        // 2. CRITICAL: Update the selection reference!
        // If the item we just changed is the one currently selected, 
        // we must update the selection object too.
        if (state.selectedKonvaItem && state.selectedKonvaItem.id === id) {
          state.selectedKonvaItem = { ...state.selectedKonvaItem, ...changes };
        }
      }
    },



    // Shortcut for dragging specifically
    /*updatePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      // const item = state.items.find(i => i.id === action.payload.id);
      const item = state.konvaData?.pages[0].children.find(i => i.id === action.payload.id);
      if (item) {
        item.x = action.payload.x;
        item.y = action.payload.y;
      }
    },*/

    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    setStatus: (state, action: PayloadAction<string>) => {
      state.statusMessage = action.payload;
    },

    reorderItem: (state, action: PayloadAction<{ id: string; type: "front" | "back" | "forward" | "backward" }>) => {
      const { id, type } = action.payload;

      if (!state.konvaData) return;
      // 1. Access the children array from your specific structure
      const children = state.konvaData?.pages[0]?.children;

      if (!children) return;

      // 2. Find the current index of the selected item
      const index = children.findIndex((item) => item.id === id);
      if (index === -1) return;

      const itemToMove = children[index];
      const newChildren = [...children];

      // 3. Remove the item from its current position
      newChildren.splice(index, 1);

      // 4. Determine the new position
      switch (type) {
        case "front":
          // Push to the end of the array (rendered last = on top)
          newChildren.push(itemToMove);
          break;

        case "back":
          // Unshift to the start of the array (rendered first = at bottom)
          newChildren.unshift(itemToMove);
          break;

        case "forward":
          // Move one index higher, capped at the array length
          const forwardIndex = Math.min(index + 1, children.length - 1);
          newChildren.splice(forwardIndex, 0, itemToMove);
          break;

        case "backward":
          // Move one index lower, capped at 0
          const backwardIndex = Math.max(index - 1, 0);
          newChildren.splice(backwardIndex, 0, itemToMove);
          break;
      }
      EditorRecordHistory(state);
      // 5. Save the new array back to the state
      state.konvaData.pages[0].children = newChildren;

      // 6. Record History (Optional: trigger your history middleware or logic here)
      // If you have an addToHistory flag, you'd handle it here.

    },

    addItem: (state, action: PayloadAction<any>) => {
      EditorRecordHistory(state);
      state.konvaData?.pages[0].children.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      EditorRecordHistory(state);
      const index = state.konvaData?.pages[0].children.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.konvaData?.pages[0].children.splice(index as number, 1);
      }
    },

    setselectedKonvaItem: (state, action: PayloadAction<any>) => {
      state.selectedKonvaItem = action.payload;
      console.log("selectedKonvaItem:", action.payload);
    },

    resetEditor: () => initialState,

    // Add these two reducers
    undo: (state) => {
      if (state.history.past.length > 0) {
        // 1. Save current state to future (for redo)
        state.history.future.unshift({
          // items: JSON.parse(JSON.stringify(state.items)),
          items: JSON.parse(JSON.stringify(state.konvaData?.pages[0].children)),
          imageUrl: state.imageUrl
        });

        // 2. Pop the last state from past
        const previous = state.history.past.pop();

        // 3. Restore items and image
        if (previous && state.konvaData) {
          // state.items = previous.items;
          state.konvaData.pages[0].children = previous.items;
          state.imageUrl = previous.imageUrl;
          syncSelectionAndControls(state);
        }
      }
    },

    redo: (state) => {
      if (state.history.future.length > 0) {
        // 1. Save current state to past (for undo)
        state.history.past.push({
          // items: JSON.parse(JSON.stringify(state.items)),
          items: JSON.parse(JSON.stringify(state.konvaData?.pages[0].children)),
          imageUrl: state.imageUrl
        });

        // 2. Pop the next state from future
        const next = state.history.future.shift();

        // 3. Restore items and image
        if (next && state.konvaData) {
          // state.items = next.items;
          state.konvaData.pages[0].children = next.items;
          state.imageUrl = next.imageUrl;
          syncSelectionAndControls(state);
        }
      }
    },
  },


  extraReducers: (builder) => {
    builder
      .addCase(updateEditorImage.pending, (state) => {
        state.isProcessing = true;
        state.statusMessage = "Uploading...";
      })
      .addCase(updateEditorImage.fulfilled, (state, action) => {
        console.log("extraReducers:: image new url:", action.payload);

        EditorRecordHistory(state);

        state.isProcessing = false;
        state.statusMessage = "Image updated successfully!";
        state.imageUrl = action.payload;

      })
      .addCase(updateEditorImage.rejected, (state, action) => {
        state.isProcessing = false;
        state.statusMessage = action.payload || "Failed to update image";
      })
      .addCase(loadEditorImageSilent.pending, (state) => {
        state.isProcessing = true;
        state.statusMessage = "Loading...";
      })
      .addCase(loadEditorImageSilent.fulfilled, (state, action) => {
        console.log("extraReducers:: image new url:", action.payload);
        state.isProcessing = false;
        state.statusMessage = "Image loaded successfully!";
        state.imageUrl = action.payload;
      })
      .addCase(loadEditorImageSilent.rejected, (state, action) => {
        state.isProcessing = false;
        state.statusMessage = action.payload || "Failed to load image";
      })
      ;
  }

});


export const updateEditorImage = createAsyncThunk<
  string | null,           // 1. The type it RETURNS (fulfilled payload)
  File,      // 2. The type of the ARGUMENT (the file)
  { rejectValue: string } // 3. Optional: type for errors
// string
>(
  'editor/updateEditorImage',
  async (file: File) => {

    await LS_SaveImageIntoIndexDB(file);
    const imageUrl = await LS_GetImageURL();
    return imageUrl;
  }
);
export const loadEditorImageSilent = createAsyncThunk<
  string | null,           // 1. The type it RETURNS (fulfilled payload)
  void,      // 2. The type of the ARGUMENT (the file)
  { rejectValue: string } // 3. Optional: type for errors
// string
>(
  'editor/loadEditorImageSilent',
  async (_, { rejectWithValue }) => {
    const imageUrl = await LS_GetImageURL();
    return imageUrl;
  }
);

/*export const SaveTheTemplate = createAsyncThunk<
  string,           // 1. The type it RETURNS (fulfilled payload)
  IEditedTemplateForSave,      // 2. The type of the ARGUMENT (the file)
  { rejectValue: string } // 3. Optional: type for errors
// string
>(
  'editor/SaveTheTemplate',
  async (templateForSaving: IEditedTemplateForSave, { rejectWithValue }) => {
    await LS_SaveTemplateIntoIndexDB(templateForSaving);
    return "Template saved successfully";
  }
);*/


export const {
  // setItems,
  // moveItemByArrow,
  setKonvaData,
  setImageUrl,
  // we have slice for the template
  // setTemplate,
  updateItem,
  // updatePosition,
  setProcessing,
  setStatus,
  resetEditor,
  setselectedKonvaItem,
  setView,
  undo,
  redo,
} = editorSlice.actions;

export const EditorActions = editorSlice.actions;
export default editorSlice.reducer;