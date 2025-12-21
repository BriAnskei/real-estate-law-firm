import { useState } from "react";
import { createChangeHandler } from "../util/createOnChangeHandler";
import { signInWithPopup } from "firebase/auth";
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

  const { errorToast, promiseToast } = useToast();
  const [signInInput, setSigninInput] = useState<SignInInputType>({
    role: "select-option",
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

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
    if (!isSignInInputFilled()) {
      return errorToast("Please complete all required fields to continue.");
    }
    setLoading(true);

    await promiseToast(
      async () => {
        await dispatch(signIn(signInInput)).unwrap();
      },
      {
        loading: "Please wait",
        success: () => "Welcome Back!",
        error: (err) => `${err || "Unknown error"}`,
      }
    );

    setTimeout(() => {
      setLoading(false);
    }, 0);
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

      setLoading(true);
      await promiseToast(
        async () => {
          await dispatch(
            googleSignIn({
              token,
              rememberMe: signInInput.rememberMe,
            })
          ).unwrap();
        },
        {
          loading: "Please wait",
          success: () => "Welcome Back!",
          error: (err) => `${err || "Unknown error"}`,
        }
      );

      setTimeout(() => {
        setLoading(false);
      }, 0);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleRoleOnChange,
    signInInput,
    toggleRememberMe,
    handleSignInOnchange,
    handleSignIn,
    handleSignInProvider,

    loading,
  };
};

export default useSignInVerification;
