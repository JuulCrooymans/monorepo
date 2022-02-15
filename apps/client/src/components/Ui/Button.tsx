import Link from "next/link";
import React from "react";
import cn from "classnames";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ButtonProps {
  children: string;
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  small?: boolean;
  secondary?: boolean;
  href?: string;
  loading?: boolean;
}

function Button({
  children,
  type,
  className,
  small,
  secondary,
  onClick,
  href,
  loading,
}: ButtonProps) {
  const style = cn(
    "w-full h-10 flex items-center justify-center shadow-sm rounded-md",
    small ? "h-8 text-sm" : "h-10",
    secondary
      ? "border dark:border-border-dark border-border-light"
      : "text-white bg-primary",
    className
  );

  if (href) {
    return (
      <Link href={href}>
        <a className={style}>
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={24} />
          ) : (
            children
          )}
        </a>
      </Link>
    );
  }

  if (onClick) {
    return (
      <button className={style} onClick={onClick}>
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" size={24} />
        ) : (
          children
        )}
      </button>
    );
  }

  return (
    <button className={style} type={type} onClick={onClick}>
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin" size={24} />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
