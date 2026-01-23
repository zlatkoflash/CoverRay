import {
  createClient,
  SupabaseClient,
  PostgrestError
} from 'https://esm.sh/@supabase/supabase-js@2'

import { ITemplate, ITemplateCategory, ITemplateCategoryWithCount } from "./Interfaces.ts";
import { CrudService } from "./ZCrud.ts";

export class ZTemplates {

  private crudCategories: CrudService<ITemplateCategory>;
  private crudCategoriesViewWithCount: CrudService<ITemplateCategoryWithCount>;
  private crudTemplates: CrudService<ITemplate>;

  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
    this.crudCategories = new CrudService<ITemplateCategory>(supabaseClient, "templates_categories");
    this.crudCategoriesViewWithCount = new CrudService<ITemplateCategoryWithCount>(supabaseClient, "view_categories_with_counts");
    this.crudTemplates = new CrudService<ITemplate>(supabaseClient, "templates");
    // this.crudCategories.
  }

  public async getCategoriesData() {


    try {
      const categories = await this.crudCategoriesViewWithCount.list({
        ascending: true,
        orderBy: "label",
        limit: 20,
        offset: 0
      });
      return categories;
    }
    catch (e) {
      console.log(e);
      return [];
    }
  }

  public async getTemplatesData(categoryId: number = 0) {
    try {
      // 3. Call your PostgreSQL function
      const { data, error } = await this.supabaseClient.rpc('get_templates_by_category', {
        cat_id: categoryId
      });
      return data;
    }
    catch (e) {
      console.log(e);
      return [];
    }

    // return [];
  }


  public async getTemplateBySlug(slug: string) {
    try {
      const template = await this.crudTemplates.getOneByField("slug", slug);
      return template;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }


}