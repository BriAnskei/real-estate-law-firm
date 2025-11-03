import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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

  const handleSignUp = async () => {
    try {
      //
    } catch (error) {}
  };

  const handleSignUpProvider = async () => {
    try {
      // if no selected role, auth provider will be cancelled
      if (signUpInput.role === "select-option") {
        toast.error("Please select your role to continue.");
        return;
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
