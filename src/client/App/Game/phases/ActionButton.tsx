import clsx from "clsx";
import { ReactElement } from "react";

type ActionButtonProps = {
  className: string;
  icon: ReactElement;
  title: string;
  description: string;
  disabled?: boolean;
  selected?: boolean;
  onClick: () => void;
};

const ActionButton = ({
  className,
  onClick,
  icon,
  title,
  description,
  disabled = false,
  selected = false,
}: ActionButtonProps) => {
  return (
    <button
      className={clsx(`w-full items-center flex py-2 my-1 pr-2`, {
        "bg-slate-200": disabled || selected,
        [className]: !disabled,
        "border-2 border-blue-400": selected,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="mx-3">{icon}</div>
      <div className="text-left">
        <div className="font-semibold">{title}</div>
        <div className="">{description}</div>
      </div>
    </button>
  );
};

export default ActionButton;
