import * as React from "react";

const useLocalStorage = (keyName: string, defaultValue: string | null) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    // SSR の場合
    if (typeof window === "undefined") {
      return defaultValue;
    }
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  });

  const setValue = (newValue: any) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
