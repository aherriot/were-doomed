import React, { useState, useEffect } from "react";
import clsx from "clsx";

type CountdownTimerProps = {
  endTime: number;
};

function computeDiff(endTime: number): number {
  const currentDate = new Date().getTime();
  return Math.floor((endTime - currentDate) / 1000);
}

const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [diff, setDiff] = useState<number>(computeDiff(endTime));
  const [visible, setVisible] = useState<boolean>(true);
  useEffect(() => {
    let timerId: number;
    timerId = window.setInterval(() => {
      setDiff(computeDiff(endTime));
      if (diff < 60) {
        setVisible((visible) => !visible);
      }
    }, 500);

    return () => window.clearInterval(timerId);
  }, [endTime, diff, setDiff]);

  const timeLeft = Math.max(diff, 0);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div
      className={clsx("text-xl font-semibold", {
        "text-red-500": timeLeft < 60 * 3,
        "text-transparent": !visible,
      })}
    >
      {minutes.toFixed(0).padStart(2, "0")}:
      {seconds.toFixed(0).padStart(2, "0")}
    </div>
  );
};

export default CountdownTimer;
