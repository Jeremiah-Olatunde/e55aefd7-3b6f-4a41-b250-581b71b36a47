import z from "zod/v4";
import { useForm } from "@tanstack/react-form";

// type FormValues = {
//   username: string;
// };

const UsernameSchema = z
  .string()
  .min(8, "Must be longer than 8 characters")
  .regex(/^\S*$/, "Must not contain any whitespace");

const FormValuesSchema = z.object({
  username: UsernameSchema,
});

type FormValues = z.infer<typeof FormValuesSchema>;

export function App() {
  console.log("component render");
  const defaultValues: FormValues = { username: "" };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: FormValuesSchema,
    },
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
        <form.Field name="username">
          {(field) => {
            console.log(field.state.meta.errors);
            const errors = field.state.meta.errors
              .filter((error) => error !== undefined)
              .map((error) => error.message);

            return (
              <div className="flex flex-col gap-2">
                <FormFieldLabel name={field.name} />

                <FormFieldInput
                  handleChange={field.handleChange}
                  inputType="text"
                  invalid={errors.length !== 0}
                  name={field.name}
                  value={field.state.value}
                />
                <FormFieldErrors errors={errors} />
              </div>
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
