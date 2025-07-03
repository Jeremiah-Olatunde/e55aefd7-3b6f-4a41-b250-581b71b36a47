import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getAsYouType, parsePhoneNumber } from "awesome-phonenumber";
import {
  FormFieldAlpha2,
  FormFieldErrors,
  FormFieldInput,
  FormFieldLabel,
  FormFieldWrapper,
} from "../components/form";

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
        <h1 className="text-3xl font-semibold text-stone-700">Tanstack Form</h1>
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
