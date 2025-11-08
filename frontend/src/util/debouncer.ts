export function debouncer<T extends (...args: any[]) => void>(
  cb: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
