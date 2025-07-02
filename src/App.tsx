import { useForm } from "@tanstack/react-form";

type FormValues = {
  username: string;
};

export function App() {
  console.log("component render");
  const defaultValues: FormValues = { username: "" };

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
        <form.Field name="username">
          {(field) => {
            return (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={field.name}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium text-stone-500 capitalize">
                    {field.name}
                  </span>
                </label>

                <input
                  id={field.name}
                  type={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Enter your name"
                  className={`
                    placeholder:font-medium placeholder:text-stone-300 
                    w-full rounded-md px-2 py-2 font-medium text-stone-500 
                    focus:outline-none focus:border-stone-300
                    border-2 border-stone-200
                    
                  `}
                />
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
