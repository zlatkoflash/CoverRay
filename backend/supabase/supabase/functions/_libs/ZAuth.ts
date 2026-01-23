import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { CrudService } from "./ZCrud.ts";
import { IProfile } from "./Interfaces.ts";
import { ISupabaseUser } from "./interfaceSupabase.ts";

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

export class ZAuth {

  private crudUsers: CrudService<IProfile>;
  constructor() {
    this.crudUsers = new CrudService<IProfile>(supabaseAdmin, "profiles");
  }

  public async logout() { }
  public async loginWithSocialProvider(provider: string) { }
  public async login(payload: {
    email: string, password: string
  }) {

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
      email_confirm: true, // Bypass email verification for instant mobile access
    });

    let errorMessage = "";
    if (!this.checkPassword(payload.password)) {
      errorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    else if (!this.checkEmail(payload.email)) {
      errorMessage = "Please enter a valid email address.";
    }
    else if (error) {
      errorMessage = error.message;
    }
    let ok = false;
    if (data && data.user !== null) {
      ok = true;
    }
    // ok = false;


    return { data, error, ok, errorMessage };
  }
  public async signup(payload: {
    email: string, password: string, confirmPassword: string
  }) {


    let errorMessage = "";
    if (!this.checkPassword(payload.password)) {
      errorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    else if (!this.checkEmail) {
      errorMessage = "Please enter a valid email address.";
    }
    else if (payload.password !== payload.confirmPassword) {
      errorMessage = "Passwords do not match.";
    }
    if (errorMessage !== "") {
      return { data: null, error: null, ok: false, errorMessage };
    }

    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true, // This makes the account active instantly!
        user_metadata: {
          role: 'designer',
          signup_date: new Date().toISOString()
        }
      });

      const crudUserForInsert = {
        email: payload.email,
        phone: null,
        display_name: null,
        created_at: new Date().toISOString(),
        last_login_at: null,
        retention_expires_at: null
      };
      console.log("crudUserForInsert:", crudUserForInsert);
      try {
        await this.crudUsers.insert(crudUserForInsert);
      }
      catch (e) {
        console.log(e);
      }


      if (error) {
        errorMessage = error.message;
      }

      let ok = false;
      if (data && data.user !== null) {
        ok = true;

        /**
         * if all okay, we login imediatelly and send back the data
         */
        const logingRespond = await this.login({
          email: payload.email,
          password: payload.password
        });
        return logingRespond;

      }

      return { data, error, ok, errorMessage };
    }
    catch (e: any) {
      return { data: null, error: e, ok: false, errorMessage: e.message };
    }
  }


  private checkPassword(password: string): boolean {
    // 1. Length Check
    if (password.length < 8 || password.length > 72) return false;

    // 2. Complexity Check
    // Added # to both the lookahead (?=.*[@$!%*?&#]) and the match set [...]
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,72}$/;

    return complexityRegex.test(password);
  }
  private checkEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  public async authorizeForPrivateRoutes(req: Request): Promise<ISupabaseUser | null> {
    try {
      const authHeader = req.headers.get('Authorization');
      console.log("DEBUG - Raw Header:", authHeader);
      if (!authHeader) return null;

      // Clean the header to get JUST the token string
      const token = authHeader.replace('Bearer ', '');

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );

      console.log("Token for auth:", token);
      // ✅ FIX: Pass the token directly into getUser
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);

      if (error || !user) {
        console.log("Auth failed:", error?.message);
        return null;
      }

      return user;
    } catch (err) {
      console.error("Internal Auth Error:", err);
      return null;
    }
  }

}