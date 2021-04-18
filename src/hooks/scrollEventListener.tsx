import { useRef, useEffect, useCallback } from "react";

const scrollEventListener = (dom: any, func?: any, threshold?: number) => {
  // const dom = useRef();

  const handleScroll = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      func();
    }
  }, []);

  useEffect(() => {
    let observer: any;
    if (dom.current) {
      observer = new IntersectionObserver(handleScroll, { threshold });
      observer.observe(dom.current);
      return () => observer && observer.disconnect();
    }
  }, [handleScroll]);
  return {
    ref: dom,
  };
};
export default scrollEventListener;
