import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const authsContext = useContext(AuthContext);
  if (!authsContext) {
    throw new Error("useAut is being used outside of the AuthProvider ");
  }
  return authsContext;
};