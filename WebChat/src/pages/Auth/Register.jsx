import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Email is invalid"),
  password: z.string().min(4, "Password must be at least 4 chars"),
  avatar: z.string().optional(),
});

export default function Register() {
  const createAccount = useUserStore((s) => s.register);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "", password: "", avatar: "" },
  });

  const onSubmit = async (data) => {
    try {
      await createAccount(data);
      navigate("/");
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.32),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.24),_transparent_34%),linear-gradient(135deg,_#04111f_0%,_#0f172a_45%,_#10253a_100%)]" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-cyan-500/18 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-emerald-500/18 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <section className="order-2 space-y-8 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Create your WebChat account
          </div>

          <div className="max-w-xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build your profile and start chatting in minutes.
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Pick a username, add your email, and join the chat experience with
              friends and groups in a polished workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Fast setup", "Create an account in seconds"],
              ["Personal", "Username and avatar support"],
              ["Connected", "Ready for chat, friends, groups"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-sm font-medium text-white">{title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">
                  {description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative order-1 lg:order-2">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-400/35 via-white/10 to-emerald-400/35 blur-xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-300/90">
                Register
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Create account
              </h2>
              <p className="text-sm leading-6 text-slate-400">
                Fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Username
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10"
                  placeholder="Choose a username"
                  {...register("username")}
                />
                {formState.errors.username && (
                  <p className="text-sm text-rose-300">
                    {formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {formState.errors.email && (
                  <p className="text-sm text-rose-300">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10"
                  placeholder="Create a secure password"
                  {...register("password")}
                />
                {formState.errors.password && (
                  <p className="text-sm text-rose-300">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Avatar URL
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10"
                  placeholder="Optional"
                  {...register("avatar")}
                />
              </div>

              <button className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110">
                Create account
                <span className="ml-2 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
