import { useEffect } from "react";

const ImportScriptTag = (resourceUrl: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
};
export default ImportScriptTag;
