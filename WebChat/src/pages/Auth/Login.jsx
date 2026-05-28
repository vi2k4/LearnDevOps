import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(4, "Password must be at least 4 chars"),
});

export default function Login() {
  const loginUser = useUserStore((s) => s.login);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data);
      navigate("/");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Invalid credentials or not registered",
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.35),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.22),_transparent_34%),linear-gradient(135deg,_#04111f_0%,_#0b1f2e_45%,_#10253a_100%)]" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/18 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-500/18 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Welcome back to WebChat
          </div>

          <div className="max-w-xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sign in and jump back into your conversations.
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Keep chats, friends, and groups in one place with a clean, fast
              workspace designed for real-time messaging.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Realtime", "Socket-based chat updates"],
              ["Secure", "JWT-backed auth flow"],
              ["Simple", "One screen to get back in"],
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

        <section className="relative">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-cyan-400/35 via-white/10 to-emerald-400/35 blur-xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/90">
                Login
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="text-sm leading-6 text-slate-400">
                Use your email and password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10"
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
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {formState.errors.password && (
                  <p className="text-sm text-rose-300">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>

              <button className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                Login
                <span className="ml-2 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>New here?</span>
                <Link
                  to="/register"
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
