import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {

    const e: Record<string, string> = {};

    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';

    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!validate()) return;

    try {

      const loggedUser = await login(email, password);

      console.log("Logged user:", loggedUser);

      if (loggedUser?.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      }
      else if (loggedUser?.role === "agent") {
        navigate("/tickets", { replace: true });
      }
      else {
        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated w-full max-w-md p-8"
      >

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground">
            HD
          </div>

          <h1 className="text-2xl font-bold">Welcome back</h1>

          <p className="text-sm text-muted-foreground">
            Sign in to your helpdesk account
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Email</label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@company.com"
              />
            </div>

            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>

            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>

      </motion.div>

    </div>
  );
};

export default Login;