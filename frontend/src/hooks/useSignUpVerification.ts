import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useToast } from "./useToast";

type SignUpInputType = {
  role:
    | "select-option"
    | "founding-manager"
    | "lawyer"
    | "paralegal"
    | "process-server";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const useSignUpVerification = () => {
  const navigate = useNavigate();
  const { errorToast } = useToast();
  const [signUpInput, setSignUpInput] = useState<SignUpInputType>({
    role: "select-option",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSignUpOnchange =
    createChangeHandler<SignUpInputType>(setSignUpInput);

  const handleRoleOnChange = (
    selectedRole:
      | "select-option"
      | "founding-manager"
      | "lawyer"
      | "paralegal"
      | "process-server"
      | any
  ) => {
    setSignUpInput((prev) => ({ ...prev, role: selectedRole }));
  };

  const signUpInputFilled = (): boolean => {
    if (signUpInput.role === "select-option") {
      return false;
    }

    if (
      !signUpInput.email.trim() ||
      !signUpInput.firstName.trim() ||
      !signUpInput.lastName.trim() ||
      !signUpInput.password.trim()
    )
      return false;

    return true;
  };

  const handleSignUp = async () => {
    try {
      if (!signUpInputFilled())
        return errorToast("Please complete all required fields to continue.");

      //
    } catch (error) {}
  };

  const handleSignUpProvider = async () => {
    try {
      // if no selected role, auth provider will be cancelled
      if (signUpInput.role === "select-option") {
        return errorToast("Please select your role to continue.");
      }
      const res = await signInWithPopup(auth, provider);

      console.log("res: ", res);
    } catch (error) {}
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  return {
    handleRoleOnChange,
    signUpInput,
    handleSignUpOnchange,
    handleSignUp,
    handleSignUpProvider,
    goToSignIn,
  };
};

export default useSignUpVerification;
