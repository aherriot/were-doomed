import clsx from "clsx";

type ButtonProps = {
  isPrimary?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

const Button = ({
  isPrimary = true,
  className = "",
  children,
  ...other
}: ButtonProps) => {
  let classes = clsx(
    "focus:shadow-outline focus:outline-none",
    {
      "shadow py-2 px-4 text-white rounded bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 font-bold":
        isPrimary,
      "text-slate-500 hover:underline focus:underline focus:text-yellow-600 hover:text-yellow-600 font-semibold":
        !isPrimary,
    },
    className
  );

  return (
    <button className={classes} {...other}>
      {children}
    </button>
  );
};

export default Button;
