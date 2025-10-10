import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";

export const useAuth = () :AuthContextType=> {
  const authsContext = useContext(AuthContext);
  if (!authsContext) {
    throw new Error("useAut is being used outside of the AuthProvider ");
  }
  return authsContext;
};