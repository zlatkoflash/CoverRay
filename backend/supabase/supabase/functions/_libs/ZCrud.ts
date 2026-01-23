import {
  createClient,
  SupabaseClient,
  PostgrestError
} from 'https://esm.sh/@supabase/supabase-js@2'

// Interface for a general database row (T) that MUST have an ID
interface DbRow {
  id: string | number;
  [key: string]: any; // Allows for any other properties
}

/**
 * A generic CRUD service class for interacting with any single Supabase table.
 * It uses generics to ensure type safety for row data.
 */
export class CrudService<T extends DbRow> {
  private tableName: string;
  private supabase: SupabaseClient;

  /**
   * @param supabaseClient - The initialized Supabase client instance (for Deno).
   * @param tableName - The name of the table this service manages (e.g., 'users', 'tours').
   */
  constructor(supabaseClient: SupabaseClient, tableName: string) {
    this.supabase = supabaseClient;
    this.tableName = tableName;
  }

  // --- C: CREATE (Insert) ---

  /**
   * Inserts a new row into the table.
   * @param data - The data object for the new row.
   * @returns The newly created row.
   */
  async insert(data: Omit<T, 'id'>): Promise<T> {
    const { data: insertedData, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting into ${this.tableName}:`, error);
      throw new Error(`Insert failed: ${error.message}`);
    }
    return insertedData as T;
  }

  // --- R: READ (Get Single Row) ---

  /**
   * Retrieves a single row by its unique ID.
   * @param id - The unique ID of the row.
   * @returns The row data, or null if not found.
   */
  async getById(id: string | number): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle to handle null/not-found without throwing

    if (error) {
      console.error(`Error fetching from ${this.tableName}:`, error);
      throw new Error(`Fetch failed: ${error.message}`);
    }
    return data as T | null;
  }

  /**
 * Fetches a single record from the table based on a specific column value.
 *
 * @template T The expected data type of the row (e.g., IUser, IProduct).
 * @param columnName The name of the column to search (e.g., 'email', 'sku', 'uuid').
 * @param columnValue The value to match in that column.
 * @returns A promise that resolves to the single record of type T, or null if not found.
 */
  async getOneByField<T>(
    columnName: keyof T | string, // Accepts any key of T for type safety, or 'string' for flexibility
    columnValue: string | number | boolean | Date | null
  ): Promise<T | null> {

    // Check for null or empty values to prevent unnecessary database calls
    if (columnValue === null || columnValue === undefined || columnValue === '') {
      return null;
    }

    // 1. Build the Supabase query:
    // .from(this.tableName) - Selects the target table
    // .select('*') - Selects all columns
    // .eq(columnName, columnValue) - Sets the dynamic WHERE clause
    // .maybeSingle() - **Ensures only 0 or 1 row is returned**
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq(columnName as string, columnValue)
      .maybeSingle();

    // 2. Handle errors
    if (error) {
      console.error(`Error fetching from ${this.tableName} by field "${columnName as string}":`, error);
      // Throwing the error allows the calling function to handle the database failure
      throw new Error(`Fetch failed for ${this.tableName} on column ${columnName as string}: ${error.message}`);
    }

    // 3. Return the result
    // The data is cast to the generic type T or remains null
    return data as T | null;
  }

  // --- U: UPDATE (Full or Partial) ---

  /**
   * Performs a full or partial update on a row by its ID.
   * @param id - The unique ID of the row to update.
   * @param updates - An object containing the fields to update.
   * @returns The updated row.
   */
  async update(id: string | number, updates: Partial<T>): Promise<T> {
    const { data: updatedData, error } = await this.supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (id === '' || id === undefined) {
      console.log("error id, updating details", id, updates);
    }

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw new Error(`Update failed: ${error.message}`);
    }
    return updatedData as T;
  }

  /**
   * Specific update function to update a single, specific column by ID.
   * @param id - The unique ID of the row.
   * @param column - The name of the column to update (e.g., 'status').
   * @param value - The new value for that column.
   * @returns The updated row.
   */
  async updateSingleVariable(id: string | number, column: keyof T, value: T[keyof T]): Promise<T> {
    // Dynamically create the updates object: { [column]: value }
    const updates: Partial<T> = { [column]: value } as Partial<T>;

    return this.update(id, updates);
  }

  // --- D: DELETE ---

  /**
   * Deletes a row by its unique ID.
   * @param id - The unique ID of the row to delete.
   * @returns The ID of the deleted row.
   */
  async delete(id: string | number): Promise<string | number> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      throw new Error(`Delete failed: ${error.message}`);
    }
    return id;
  }


  /**
  * Fetches multiple records based on an object of field-value pairs.
  * Useful for complex filtering (e.g., { status: 'succeeded', currency: 'USD' }).
  * * @param filters - An object where keys are column names and values are the values to match.
  * @returns A promise resolving to an array of matching rows.
  */
  /**
 * Fetches multiple records based on field-value pairs with optional ordering and limiting.
 * @param filters - Object with column-value pairs to match.
 * @param options - Optional configuration for sorting and pagination.
 */
  async getByFields(
    filters: Partial<T>,
    options?: {
      orderBy?: keyof T;
      ascending?: boolean;
      limit?: number
    }
  ): Promise<T[]> {
    // 1. Filter out null/undefined values
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(activeFilters).length === 0) {
      return [];
    }

    // 2. Start building the query
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .match(activeFilters);

    // 3. Apply Order By if provided (defaults to id if not specified but limit is used)
    if (options?.orderBy) {
      query = query.order(options.orderBy as string, {
        ascending: options.ascending ?? false
      });
    }

    // 4. Apply Limit if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching from ${this.tableName}:`, error);
      throw new Error(`Fetch by fields failed: ${error.message}`);
    }

    return (data || []) as T[];
  }


  /**
   * Fetches rows from the table with optional sorting and limiting.
   * Useful for general listings or "Top X" queries.
   * * @param options - Configuration for the query.
   * @returns A promise resolving to an array of rows.
   */
  async list(options?: {
    orderBy?: keyof T;
    ascending?: boolean;
    limit?: number;
    offset?: number; // Added offset for pagination
  }): Promise<T[]> {

    // 1. Start the query
    let query = this.supabase
      .from(this.tableName)
      .select('*');

    // 2. Apply Ordering (Defaults to 'created_at' or 'id' if you prefer)
    const sortColumn = (options?.orderBy || 'id') as string;
    query = query.order(sortColumn, {
      ascending: options?.ascending ?? false, // Default to descending (newest first)
    });

    // 3. Apply Limit
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    // 4. Apply Offset (for "Load More" or Page 2, 3, etc.)
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error listing from ${this.tableName}:`, error);
      throw new Error(`List failed: ${error.message}`);
    }

    return (data || []) as T[];
  }




}