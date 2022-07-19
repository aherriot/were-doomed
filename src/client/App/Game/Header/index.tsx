import React from "react";
import CountdownTimer from "./CountdownTimer";

type HeaderProps = {
  endTime: number | null;
};

const Header = ({ endTime }: HeaderProps) => {
  return (
    <div className="Header">
      <h1 className="Title">We're Doomed</h1>
      {endTime && <CountdownTimer endTime={endTime} />}
    </div>
  );
};

export default Header;
