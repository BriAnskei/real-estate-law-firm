import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { googleSignIn, signIn } from "../store/Slice/authSlice";
import { useToast } from "./useToast";

export type SignInInputType = {
  role:
    | "select-option"
    | "founding-manager/admin"
    | "lawyer"
    | "paralegal"
    | "process-server";

  email: string;
  password: string;
  rememberMe: boolean;
};

const useSignInVerification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { errorToast } = useToast();
  const [signInInput, setSigninInput] = useState<SignInInputType>({
    role: "select-option",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSignInOnchange =
    createChangeHandler<SignInInputType>(setSigninInput);

  const handleRoleOnChange = (
    selectedRole:
      | "founding-manager/admin"
      | "lawyer"
      | "paralegal"
      | "process-server"
      | any // defaukt value
  ) => {
    setSigninInput((prev) => ({ ...prev, role: selectedRole }));
  };

  const toggleRememberMe = () => {
    setSigninInput((prev) => ({
      ...prev,
      rememberMe: !signInInput.rememberMe,
    }));
  };

  const handleSignIn = async () => {
    try {
      if (!isSignInInputFilled()) {
        return errorToast("Please complete all required fields to continue.");
      }

      await dispatch(signIn(signInInput)).unwrap();
    } catch (error) {
      console.log(error);
      errorToast(error as string);
    }
  };

  const isSignInInputFilled = (): boolean => {
    if (signInInput.role === "select-option") return false;

    if (!signInInput.email.trim() || !signInInput.password.trim()) return false;

    return true;
  };

  const handleSignInProvider = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();

      dispatch(
        googleSignIn({
          token,
          rememberMe: signInInput.rememberMe,
        })
      );
    } catch (error) {
      const res = await signInWithRedirect(auth, provider);
    }
  };

  return {
    handleRoleOnChange,
    signInInput,
    toggleRememberMe,
    handleSignInOnchange,
    handleSignIn,
    handleSignInProvider,
  };
};

export default useSignInVerification;
