import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleLogout } from "@/slice/authSlice";
import AuthWrapper from "./Wrapper";

export default function LogOut() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(handleLogout());
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <AuthWrapper title="Signing Out">
      <p>Signing you out...</p>
    </AuthWrapper>
  );
}
