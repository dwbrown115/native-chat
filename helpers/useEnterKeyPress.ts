import { useEffect } from "react";

// Custom hook to listen for Enter key press
export default function useEnterKeyPress(onEnterPressed: Function) {
  useEffect(() => {
    function handleKeyPress(event: any) {
      if (event.key === "Enter") {
        onEnterPressed();
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onEnterPressed]);
}
