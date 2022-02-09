import React from "react";
import cn from "classnames";

interface ButtonProps {
  children: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
}

function Button({ children, type, className }: ButtonProps) {
  const style = cn(
    "w-full h-10 flex items-center justify-center bg-black text-white rounded-md",
    className
  );

  return (
    <button className={style} type={type}>
      {children}
    </button>
  );
}

export default Button;
