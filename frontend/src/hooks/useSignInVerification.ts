import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";

import { useNavigate } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";

type signInInputType = {
  role:
    | "select-option"
    | "founding-manager"
    | "lawyer"
    | "paralegal"
    | "process-server";

  email: string;
  password: string;
  rememberMe: boolean;
};

const useSignInVerification = () => {
  const navigate = useNavigate();
  const [signInInput, setSigninInput] = useState<signInInputType>({
    role: "select-option",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSignInOnchange =
    createChangeHandler<signInInputType>(setSigninInput);

  const handleRoleOnChange = (
    selectedRole:
      | "founding-manager"
      | "lawyer"
      | "paralegal"
      | "process-server"
      | any // deefaukt value
  ) => {
    setSigninInput((prev) => ({ ...prev, role: selectedRole }));
  };

  const toggleRememberMe = () => {
    setSigninInput((prev) => ({
      ...prev,
      rememberMe: !signInInput.rememberMe,
    }));
  };

  const handleSignIn = () => {
    try {
      //
      console.log('inputs:" ', signInInput);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerAuthProvider = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      console.log("provideer res: ", res);
      //
    } catch (error) {}
  };

  return {
    handleRoleOnChange,
    signInInput,
    toggleRememberMe,
    handleSignInOnchange,
    handleSignIn,
    handlerAuthProvider,
  };
};

export default useSignInVerification;
