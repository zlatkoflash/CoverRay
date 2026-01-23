import { getApiData } from "@/utils/api";
import { ITemplate, ITemplateCategory, ITemplateCategoryWithCount } from "@/utils/interfaceDatabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITemplateState {
  categories: ITemplateCategoryWithCount[];
  selectedCategory: number;
  templates: ITemplate[];
  selectedTemplate: ITemplate | null;

  ContinueButttonDisabled: boolean;


}

const initialState: ITemplateState = {
  categories: [],
  selectedCategory: 0,
  templates: [],
  selectedTemplate: null,
  ContinueButttonDisabled: false,
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ITemplateCategoryWithCount[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<number>) => {
      state.selectedCategory = action.payload;
    },
    setTemplates: (state, action: PayloadAction<ITemplate[]>) => {
      state.templates = action.payload;
      // state.ContinueButttonDisabled = action.payload.length === 0;
    },
    setSelectedTemplate: (state, action: PayloadAction<ITemplate | null>) => {
      state.selectedTemplate = action.payload;
      state.ContinueButttonDisabled = action.payload === null && state.templates.length > 0;
    },
    setContinueButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.ContinueButttonDisabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error('Failed to fetch categories:', action.error);
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        console.error('Failed to fetch templates:', action.error);
      });
  },
});

export const fetchCategories = createAsyncThunk(
  'templates/fetchCategories',
  async () => {
    const data = await getApiData<{
      ok: boolean;
      categories: ITemplateCategoryWithCount[];
    }>("/templates/get-categories", "POST", {}, "not-authorize", "application/json");
    console.log("categories:", data.categories);
    return data.categories;

  }
);

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (categoryId: number) => {
    const data = await getApiData<{
      ok: boolean;
      templates: ITemplate[];
    }>("/templates/get-templates", "POST", { category_id: categoryId }, "not-authorize", "application/json");
    console.log("templates:", data.templates);
    // return [];
    return data.templates;

  }
);


export const { setCategories } = templatesSlice.actions;
export const templatesActions = templatesSlice.actions;
export default templatesSlice.reducer;