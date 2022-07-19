import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<typeof callback>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    let id = window.setInterval(tick, delay);
    return () => window.clearInterval(id);
  }, [delay]);
};

export default useInterval;
