import React from "react";

const Input = ({
  label = "",
  name,
  className,
  register,
  type = "text",
  isRequired = false,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 mt-2">
      {label && (
        <label className="text-teal-light text-lg px-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        className={`bg-input-background text-start focus:outline-none h-10 rounded-lg px-5 py-4 w-full ${className}`}
        type={type}
        {...register(name, { required: isRequired })}
        {...props}
      />
    </div>
  );
};

export default Input;
