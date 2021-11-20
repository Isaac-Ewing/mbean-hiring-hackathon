import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const Url = import.meta.env.SUPABASE_URL;
  const Key = import.meta.env.SUPABASE_KEY;
  const supabase = createClient(Url, Key);

  return (
    <AppContext.Provider
      value={{
        supabase,
        auth: supabase.auth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };
