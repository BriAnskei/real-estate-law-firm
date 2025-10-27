import { Dispatch, SetStateAction } from "react";

type ExtraCallback = () => void;

export function createChangeHandler<T>(
  setState: Dispatch<SetStateAction<T>>,
  extraCallbacks: ExtraCallback[] = []
) {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Generic update by field name
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Run additional callbacks
    extraCallbacks.forEach((cb) => cb());
  };
}
