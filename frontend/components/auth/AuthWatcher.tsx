"use client";

import { useEffect, useRef } from "react";
// import { createClient } from "@/utils/supabase/client";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";

export default function AuthWatcher() {
  // creating new supabase/ssr(server side rendering) client
  const supabase = createClient();
  const dispatch = useDispatch();
  const router = useRouter();

  // Use a ref to prevent double-initialization in React Strict Mode
  const initialized = useRef(false);

  useEffect(() => {
    // 1. INITIAL SESSION CHECK
    // This runs immediately when the app loads to fill Redux before the user sees anything
    const initializeSession = async () => {
      if (initialized.current) return;
      initialized.current = true;

      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // session.user.id
        // dispatch(authActions.setUser(session.user));
        dispatch(authActions.setUser(session.user as any));
      } else {
        // dispatch(authActions.clearAuth());
        dispatch(authActions.setUser(null));
      }
    };

    initializeSession();

    // 2. THE EVENT LISTENER
    // This is the "Switchboard" that listens for signals from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log("Auth Event:", event);
        console.log("Auth Session:", session);

        // Scenario: User logs in or token is refreshed in the background
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            /*dispatch(authActions.setAuth({
              user: session.user,
              isAuthenticated: true
            }));*/
            dispatch(authActions.setUser(session.user));
          }
        }

        // Scenario: User logs out (from THIS tab OR another tab)
        if (event === "SIGNED_OUT") {
          /*dispatch(authActions.clearAuth());*/

          // router.refresh clears the Next.js server-side cache for the current page
          dispatch(authActions.setUser(null));
          router.refresh();
          // router.push("/login");
        }

        // Scenario: Password changed or user deleted
        if (event === "USER_UPDATED") {
          if (session?.user) {
            // dispatch(authActions.setAuth({ user: session.user, isAuthenticated: true }));
            dispatch(authActions.setUser(session.user));
          }
        }
      }
    );

    // 3. CLEANUP
    // Very important to prevent memory leaks when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router, supabase.auth]);

  return null;
}