import { useState } from "react";
import Flag from "react-world-flags";
import { pipe } from "fp-ts/function";
import * as option from "fp-ts/Option";
import { type Option } from "fp-ts/Option";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";

export function FormFieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="relative flex flex-col gap-2">{children}</div>;
}

export function FormFieldAlpha2({
  alpha2,
  handleClick,
}: {
  alpha2: Option<string>;
  handleClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="border-2 border-stone-200 aspect-[1.5] cursor-pointer bg-stone-100 rounded-md p-2 pr-0.5 gap-1 flex justify-between items-center"
    >
      <div className="grow rounded-full p-0.5 flex justify-center items-center h-full">
        {pipe(
          alpha2,
          option.map((a2) => <Flag code={a2} style={{ width: "24px" }} />),
          option.getOrElse(() => <Globe className="text-stone-500" />),
        )}
      </div>
      <ChevronDown className="text-stone-500 size-5" />
    </button>
  );
}

export function FormFieldInput({
  name,
  inputType,
  value,
  handleChange,
  invalid,
}: {
  name: string;
  inputType: string;
  invalid: boolean;
  value: string;
  handleChange: (v: string) => void;
}) {
  return (
    <input
      id={name}
      type={inputType}
      name={name}
      value={value}
      placeholder={`Enter your ${name.toLowerCase()}`}
      onChange={(event) => handleChange(event.target.value)}
      className={`
        grow border-2 
        w-full rounded-md px-2 py-2 font-medium text-stone-500 
        placeholder:font-medium placeholder:text-stone-300 
        focus:outline-none
        ${invalid ? "border-red-300  focus:border-red-400" : "border-stone-200  focus:border-stone-200"}
      `}
    />
  );
}

export function FormFieldLabel({ name }: { name: string }) {
  return (
    <label htmlFor={name} className="flex justify-between items-center">
      <span className="font-medium text-stone-500 capitalize">{name}</span>
    </label>
  );
}

export function FormFieldErrors({ errors }: { errors: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (errors.length === 0) {
    return;
  }

  const [first, ...rest] = errors;

  return (
    <div className="flex justify-between items-start gap-1 py-1 px-2 bg-red-50 rounded-xs">
      <div className="grow flex flex-col gap-1">
        <span key={first} className="text-xs text-red-500 font-semibold">
          {first}*
        </span>
        {expanded &&
          rest.map((error) => {
            return (
              <span key={error} className="text-xs text-red-500 font-semibold">
                {error}*
              </span>
            );
          })}
      </div>
      {rest.length !== 0 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-red-500 text-xs font-semibold flex"
        >
          <span className="">({rest.length + 1})</span>
          {expanded ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
      )}
    </div>
  );
}
