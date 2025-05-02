import { Link, useLocation } from "wouter";
import { AuthLayout } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-primary/10 flex flex-col items-center justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-[420px] p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-xl"
      >
        <motion.div
          className="flex justify-center mb-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Logo size="lg" variant="full" />
        </motion.div>

        <motion.h2
          variants={fadeIn}
          className="text-3xl font-semibold text-center mb-2"
        >
          Log in
        </motion.h2>

        <motion.p
          variants={fadeIn}
          className="text-center text-muted-foreground mb-8"
        >
          Entre para acessar seu workspace
        </motion.p>

        <motion.form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          variants={staggerChildren}
        >
          <motion.div className="space-y-4" variants={staggerChildren}>
            <motion.div
              className="relative"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`pl-10 h-12 text-base transition-all duration-300 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                {...register("password")}
                className={`pl-10 h-12 text-base transition-all duration-300 ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            variants={fadeIn}
          >
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" {...register("rememberMe")} />
              <Label htmlFor="remember-me" className="text-sm font-normal">
                Lembrar-me
              </Label>
            </div>

            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </motion.div>

          <motion.div
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-full bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90 transition-all duration-300"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div className="flex items-center my-8" variants={fadeIn}>
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-sm text-muted-foreground">Ou</span>
          <div className="flex-1 border-t border-border"></div>
        </motion.div>

        <motion.div className="space-y-4" variants={staggerChildren}>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="h-12 text-base font-normal rounded-full flex items-center justify-center w-full backdrop-blur-sm hover:bg-white/50 dark:hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="mr-2"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="h-12 text-base font-normal rounded-full flex items-center justify-center w-full backdrop-blur-sm hover:bg-white/50 dark:hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="mr-2"
                >
                  <rect width="24" height="24" fill="#0A66C2" rx="2" />
                  <path
                    fill="#FFFFFF"
                    d="M19.04 19h-2.89v-4.51c0-1.07-.02-2.46-1.5-2.46-1.5 0-1.73 1.17-1.73 2.38V19h-2.89V9.04h2.77v1.27h.04c.38-.73 1.33-1.5 2.73-1.5 2.92 0 3.46 1.92 3.46 4.42V19zM6.75 7.77a1.676 1.676 0 01-1.67-1.68c0-.93.75-1.68 1.67-1.68.93 0 1.68.75 1.68 1.68 0 .93-.75 1.68-1.68 1.68zm-1.44 11.23h2.89V9.04H5.31V19z"
                  />
                </svg>
                LinkedIn
              </Button>
            </motion.div>
          </div>

          <motion.div className="text-center" variants={fadeIn}>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Criar conta
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mt-8 text-sm text-muted-foreground"
      >
        <p>&copy; {new Date().getFullYear()} Nexion. All rights reserved.</p>
      </motion.div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-400/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
