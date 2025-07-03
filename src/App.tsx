import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { NG } from "country-flag-icons/react/3x2";
import { getAsYouType, parsePhoneNumber } from "awesome-phonenumber";

const NameSchema = z
  .string()
  .min(2, "Must be longer than 2 characters")
  .regex(/^[\w\s-]*$/, "May not include symbols");

const EmailSchema = z.email("Must be a valid email");

const UsernameSchema = z
  .string()
  .min(8, "Must be longer than 8 characters")
  .regex(/^\S*$/, "Must not contain any whitespace");

const PasswordSchema = z
  .string()
  .min(8, "Must be longer than 8 characters")
  .regex(/^\S*$/, "Must not contain any whitespace")
  .regex(/^.*[0-9]+.*$/, "Must have one digit")
  .regex(/^.*[A-Z]+.*$/, "Must have one uppercase letter")
  .regex(/^.*[a-z]+.*$/, "Must have one lowercase letter")
  .regex(/^.*[@#$%^&*!)(-]+.*$/, "Must have one symbol");

type FormValues = {
  name: string;
  email: string;
  password: string;
  username: string;
  telephone: string;
};

export function App() {
  console.log("component render");

  const defaultValues: FormValues = {
    name: "",
    email: "",
    password: "",
    username: "",
    telephone: "",
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log("submitting form", value);
    },
  });

  return (
    <section className="font-sora h-screen w-screen p-6 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Tanstack Form</h1>
        <p className="text-stone-500 font-medium">
          Lets see what tanner is on about again
        </p>
      </header>
      <form
        className="grow flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="email" validators={{ onChange: EmailSchema }}>
          {(field) => {
            const errors = field.state.meta.errors
              .filter((error) => error !== undefined)
              .map((error) => error.message);

            return (
              <FormFieldWrapper>
                <FormFieldLabel name={field.name} />

                <FormFieldInput
                  handleChange={field.handleChange}
                  inputType="email"
                  invalid={errors.length !== 0}
                  name={field.name}
                  value={field.state.value}
                />
                <FormFieldErrors errors={errors} />
              </FormFieldWrapper>
            );
          }}
        </form.Field>

        <form.Field name="name" validators={{ onChange: NameSchema }}>
          {(field) => {
            const errors = field.state.meta.errors
              .filter((error) => error !== undefined)
              .map((error) => error.message);

            return (
              <FormFieldWrapper>
                <FormFieldLabel name={field.name} />

                <FormFieldInput
                  handleChange={field.handleChange}
                  inputType="name"
                  invalid={errors.length !== 0}
                  name={field.name}
                  value={field.state.value}
                />
                <FormFieldErrors errors={errors} />
              </FormFieldWrapper>
            );
          }}
        </form.Field>

        <form.Field name="username" validators={{ onChange: UsernameSchema }}>
          {(field) => {
            const errors = field.state.meta.errors
              .filter((error) => error !== undefined)
              .map((error) => error.message);

            return (
              <FormFieldWrapper>
                <FormFieldLabel name={field.name} />

                <FormFieldInput
                  handleChange={field.handleChange}
                  inputType="text"
                  invalid={errors.length !== 0}
                  name={field.name}
                  value={field.state.value}
                />
                <FormFieldErrors errors={errors} />
              </FormFieldWrapper>
            );
          }}
        </form.Field>

        <form.Field name="password" validators={{ onChange: PasswordSchema }}>
          {(field) => {
            const errors = field.state.meta.errors
              .filter((error) => error !== undefined)
              .map((error) => error.message);

            return (
              <FormFieldWrapper>
                <FormFieldLabel name={field.name} />

                <div className="relative w-full">
                  <FormFieldInput
                    handleChange={field.handleChange}
                    inputType={passwordVisible ? "text" : "password"}
                    invalid={errors.length !== 0}
                    name={field.name}
                    value={field.state.value}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0  border-2 border-white/0 p-2 h-full flex justify-center items-center"
                  >
                    {passwordVisible ? (
                      <Eye className="size-5 text-stone-200" />
                    ) : (
                      <EyeOff className="size-5 text-stone-200" />
                    )}
                  </button>
                </div>
                <FormFieldErrors errors={errors} />
              </FormFieldWrapper>
            );
          }}
        </form.Field>

        <form.Field
          name="telephone"
          validators={{
            onChange: ({ value }) => {
              const alpha2 = "NG";
              const parsed = parsePhoneNumber(value, { regionCode: alpha2 });
              console.log(parsed.valid);

              if (!parsed.valid) {
                return ["must be a valid phone number"];
              }

              if (parsed.regionCode !== alpha2) {
                return ["phone number does not match selected region"];
              }
            },
          }}
        >
          {(field) => {
            const errors = field.state.meta.errors.filter(
              (error) => error !== undefined,
            );

            return (
              <FormFieldWrapper>
                <FormFieldLabel name={field.name} />

                <div className="flex flex-row gap-2 justify-between">
                  <FormFieldAlpha2 />

                  <FormFieldInput
                    handleChange={(value) => {
                      if (!/^[\d\s-]*$/.test(value)) return;

                      const formatter = getAsYouType("NG");
                      const formatted = formatter.reset(value);
                      const parsed = formatter.getPhoneNumber();
                      field.handleChange(
                        parsed.valid ? parsed.number.national : formatted,
                      );
                    }}
                    inputType="tel"
                    invalid={errors.length !== 0}
                    name={field.name}
                    value={field.state.value}
                  />
                </div>

                <FormFieldErrors errors={errors} />
              </FormFieldWrapper>
            );
          }}
        </form.Field>

        <div className="flex justify-end">
          <button
            className=" bg-stone-500 rounded-md text-sm text-white font-semibold px-4 py-2 capitalize cursor-pointer"
            type="submit"
          >
            register
          </button>
        </div>
      </form>
    </section>
  );
}

function FormFieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="relative flex flex-col gap-2">{children}</div>;
}

function FormFieldAlpha2() {
  return (
    <button
      type="button"
      className="aspect-[1.5] cursor-pointer bg-stone-100 rounded-md p-2 pr-0.5 gap-1 flex justify-between items-center"
    >
      <div className="grow rounded-full p-0.5">
        <NG />
      </div>
      <ChevronDown className="text-stone-500 size-5" />
    </button>
  );
}

function FormFieldInput({
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

function FormFieldLabel({ name }: { name: string }) {
  return (
    <label htmlFor={name} className="flex justify-between items-center">
      <span className="font-medium text-stone-500 capitalize">{name}</span>
    </label>
  );
}

function FormFieldErrors({ errors }: { errors: string[] }) {
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
