import { getApiData } from "@/utils/api";
import { ITemplate, ITemplateCategory, ITemplateCategoryWithCount, ITemplateVersion } from "@/utils/interfaceDatabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITemplateState {
  categories: ITemplateCategoryWithCount[];
  subcategories: ITemplateCategoryWithCount[];
  selectedCategory: ITemplateCategoryWithCount | null;
  selectedSubCategory: ITemplateCategoryWithCount | null;
  // selectedCategory: number;
  templates: ITemplate[];
  selectedTemplate: ITemplate | null;

  ContinueButttonDisabled: boolean;

  /**
   * When the select in administrator is set to draft this will be true,
   * we will see where we can use isDraft variable
   */
  isDraft: boolean;
  versions: ITemplateVersion[];
  selectedVersion: "draft" | "live" | number;

  /**
   * This will be true when the editor is loaded for the first time
   * the hydration is happening here: <HomePageHydration />
   */
  isEditorInitialHydrated: boolean;

}

const initialState: ITemplateState = {
  categories: [],
  subcategories: [],
  selectedCategory: null,
  selectedSubCategory: null,

  isEditorInitialHydrated: false,

  templates: [],
  selectedTemplate: null,
  ContinueButttonDisabled: false,
  isDraft: false,
  versions: [],
  selectedVersion: "live"
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ITemplateCategoryWithCount[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<ITemplateCategoryWithCount | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedSubCategory: (state, action: PayloadAction<ITemplateCategoryWithCount | null>) => {
      state.selectedSubCategory = action.payload;
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
    setIsDraft: (state, action: PayloadAction<boolean>) => {
      state.isDraft = action.payload;
    },
    setVersions: (state, action: PayloadAction<ITemplateVersion[]>) => {
      state.versions = action.payload;
    },

    setIsEditorInitialHydrated: (state, action: PayloadAction<boolean>) => {
      state.isEditorInitialHydrated = action.payload;
    },

    /**
     * In administrator part we have dropdown draft, live-template and versions ids. Selecting those will load teh konva data for the template for the next manipulations
     */
    setSelectedVersion: (state, action: PayloadAction<"draft" | "live" | number>) => {
      state.selectedVersion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.templates = action.payload.templates;
        state.selectedCategory = action.payload.categories[0];
        state.selectedSubCategory = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload.subcategories;
        state.templates = action.payload.templates;
        state.selectedSubCategory = null;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        console.error('Failed to fetch subcategories:', action.error);
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
      subcategories: ITemplateCategoryWithCount[];
      templates: ITemplate[];
    }>("/templates/get-categories", "POST", {}, "not-authorize", "application/json");

    console.log("data for templates/get-categories:", data);
    console.log("categories:", data.categories);
    // return data.categories;
    return data;
  }
);

export const fetchSubcategories = createAsyncThunk(
  'templates/fetchSubcategories',
  // Ray need labels
  async (parentCategory_id: number) => {
    const data = await getApiData<{
      ok: boolean;
      subcategories: ITemplateCategoryWithCount[];
      templates: ITemplate[];
    }>('/templates/get-subcategories', 'POST', {
      // category_label: categoryLabel 
      parentCategory_id
    }, 'not-authorize', 'application/json');
    console.log('subcategories:', data.subcategories);
    // return data.subcategories;
    return data;
  }
);

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (
    categoryId: number,
    // Ray is forcing with labels
    // { categoryLabel, subcategoryLabel }: { categoryLabel: string, subcategoryLabel: string }
  ) => {
    const data = await getApiData<{
      ok: boolean;
      templates: ITemplate[];
    }>("/templates/get-templates", "POST", {
      category_id: categoryId
    }, "not-authorize", "application/json");
    console.log("templates loaded for category:", categoryId, data.templates);
    // return [];
    return data.templates;

  }
);


export const { setCategories } = templatesSlice.actions;
export const templatesActions = templatesSlice.actions;
export default templatesSlice.reducer;