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
    "border px-3 flex items-center h-10 rounded-md shadow-sm focus:outline-none ",
    error
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-gray-500",
    className
  );

  return (
    <label className="flex flex-col">
      <div className="flex justify-between mb-1 px-2">
        <span
          className={cn("text-sm", error ? "text-red-500" : "text-gray-600")}
        >
          {label}
        </span>
        {error && (
          <span className="text-right text-sm text-red-500">
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
