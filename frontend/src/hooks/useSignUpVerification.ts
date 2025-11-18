import { useCallback, useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../provider/firebaseConfig";

import { useToast } from "./useToast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { googleSignUp, signIn, signUp } from "../store/Slice/authSlice";

export type SignUpInputType = {
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

  const { errorToast, successToast, promiseToast } = useToast();
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
    if (!signUpInputFilled())
      return errorToast("Please complete all required fields to continue.");

    await promiseToast(
      async () => {
        await dispatch(signUp(signUpInput)).unwrap();
      },
      {
        loading: "Submitting registration...",
        success: () =>
          "Registration successful! Please wait for the Administrator's approval.",
        error: (err) =>
          `Failed to register: ${
            err || "Something went wrong. Please try again."
          }`,
      }
    );
    setSignUpInput(initialInput);

    navigate("/signin");
  };

  const handleSignUpProvider = useCallback(async () => {
    try {
      if (signUpInput.role === "select-option")
        return errorToast("Please select your role to continue.");

      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();

      await promiseToast(
        async () => {
          await dispatch(
            googleSignUp({ token, role: signUpInput.role })
          ).unwrap();
        },
        {
          loading: "Submitting registration...",
          success: () =>
            "Registration successful! Please wait for the Administrator's approval.",
          error: (err) =>
            `Failed to register: ${
              err || "Something went wrong. Please try again."
            }`,
        }
      );

      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  }, [signUpInput]);

  return {
    handleRoleOnChange,
    signUpInput,
    handleSignUpOnchange,
    handleSignUp,
    handleSignUpProvider,
  };
};

export default useSignUpVerification;
