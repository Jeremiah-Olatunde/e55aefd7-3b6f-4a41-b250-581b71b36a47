import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// type FormValues = {
//   username: string;
// };

const UsernameSchema = z
  .string()
  .min(8, "Must be longer than 8 characters")
  .regex(/^\S*$/, "Must not contain any whitespace");

const PasswordSchema = z
  .string()
  .min(8, "Must be longer than 8 characters")
  .regex(/^\S*$/, "Must not contain any whitespace");

const FormValuesSchema = z.object({
  password: PasswordSchema,
  username: UsernameSchema,
});

type FormValues = z.infer<typeof FormValuesSchema>;

export function App() {
  console.log("component render");
  const password = "";
  const username = "";
  const defaultValues: FormValues = { password, username };

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
        border-2 
        w-full rounded-md px-2 py-2 font-medium text-stone-500 
        placeholder:font-medium placeholder:text-stone-300 
        focus:outline-none
        ${invalid ? "border-red-500  focus:border-red-500" : "border-stone-200  focus:border-stone-200"}
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
  return (
    <div className="flex flex-col gap-1">
      {errors.map((error) => {
        return (
          <span key={error} className="text-xs text-red-500 font-semibold">
            {error}*
          </span>
        );
      })}
    </div>
  );
}
