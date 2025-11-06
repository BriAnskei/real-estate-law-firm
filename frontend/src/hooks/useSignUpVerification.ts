import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";

import { useToast } from "./useToast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { googleSignUp } from "../store/Slice/authSlice";

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

const initialInput: SignUpInputType = {
  role: "select-option",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const useSignUpVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { errorToast, successToast } = useToast();
  const [signUpInput, setSignUpInput] = useState<SignUpInputType>(initialInput);

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

      successToast(
        "Submission successful. Please wait for the Administrator’s approval."
      );

      setSignUpInput(initialInput);
    } catch (error) {
    } finally {
      navigate("/signin");
    }
  };

  const handleSignUpProvider = async () => {
    try {
      // if no selected role, auth provider will be cancelled
      if (signUpInput.role === "select-option")
        return errorToast("Please select your role to continue.");

      console.log("signing up with provider");

      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();

      await dispatch(googleSignUp({ token, role: signUpInput.role })).unwrap();

      successToast(
        "Submission successful. Please wait for the Administrator’s approval."
      );
      navigate("/signin");
    } catch (error) {
      console.log(error);
      errorToast(error as string);
    }
  };

  return {
    handleRoleOnChange,
    signUpInput,
    handleSignUpOnchange,
    handleSignUp,
    handleSignUpProvider,
  };
};

export default useSignUpVerification;
