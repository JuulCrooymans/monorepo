import { UseFormRegisterReturn, ErrorOption } from "react-hook-form";
import cn from "classnames";

interface InputProps {
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  error?: {
    message: string;
    type: ErrorOption["type"];
    ref: any;
  };
}

function Input({
  label,
  register,
  type,
  placeholder,
  className,
  error,
}: InputProps) {
  const inputStyle = cn(
    "border px-3 flex items-center h-10 rounded-md shadow-sm focus:outline-none  dark:bg-dark",
    error
      ? "border-danger focus:border-danger"
      : "border-gray-300 dark:border-border-dark border-border-light dark:focus:border-border-dark-active",
    className
  );

  return (
    <label className="flex flex-col">
      <div className="flex justify-between mb-1 px-2">
        <span
          className={cn(
            "text-sm",
            error ? "text-danger" : "dark:text-text-dark-300 text-text-300"
          )}
        >
          {label}
        </span>
        {error && (
          <span className="text-right text-sm text-danger">
            {error.message}
          </span>
        )}
      </div>
      <input
        className={inputStyle}
        type={type ?? "text"}
        placeholder={placeholder ?? ""}
        {...register}
      />
    </label>
  );
}

export default Input;
