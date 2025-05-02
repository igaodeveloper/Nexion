import { useState } from "react";
import { AppLayout } from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Session } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Tab content type
type ProfileTab = "personal-info" | "security" | "session-history";

// Password change schema
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória"),
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");
  const { toast } = useToast();

  // Fetch user data
  const { data: user, isLoading: loadingUser } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Fetch session history
  const { data: sessions, isLoading: loadingSessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
    enabled: activeTab === "session-history",
  });

  // Form for password change
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChangeData) => {
      await apiRequest("PATCH", "/api/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Falha ao alterar senha",
        description:
          error.message || "Verifique sua senha atual e tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Handle tab change
  const switchTab = (tab: ProfileTab) => {
    setActiveTab(tab);
  };

  // Handle password change submission
  const onPasswordChangeSubmit = (data: PasswordChangeData) => {
    changePasswordMutation.mutate(data);
  };

  // Handle profile field edit
  const handleFieldEdit = (field: string, value: string) => {
    // In a real app, would open an edit modal or inline edit field
    toast({
      title: "Editar campo",
      description: `Editando o campo ${field}`,
    });
  };

  if (loadingUser) {
    return (
      <AppLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium flex-1 text-center ${activeTab === "personal-info" ? "tab-active" : "text-gray-700 hover:bg-gray-50"}`}
            onClick={() => switchTab("personal-info")}
          >
            Informações Pessoais
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium flex-1 text-center ${activeTab === "security" ? "tab-active" : "text-gray-700 hover:bg-gray-50"}`}
            onClick={() => switchTab("security")}
          >
            Segurança
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium flex-1 text-center ${activeTab === "session-history" ? "tab-active" : "text-gray-700 hover:bg-gray-50"}`}
            onClick={() => switchTab("session-history")}
          >
            Histórico de sessão
          </button>
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal-info" && (
          <div className="p-6">
            <div className="space-y-4 max-w-xl">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-700">
                  Nome
                </Label>
                <div className="flex items-center">
                  <span className="mr-4">{user?.firstName}</span>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() =>
                      handleFieldEdit("firstName", user?.firstName || "")
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <Label className="text-sm font-medium text-gray-700">
                  Sobrenome
                </Label>
                <div className="flex items-center">
                  <span className="mr-4">{user?.lastName}</span>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() =>
                      handleFieldEdit("lastName", user?.lastName || "")
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <Label className="text-sm font-medium text-gray-700">
                  UserName
                </Label>
                <div className="flex items-center">
                  <span className="mr-4">@{user?.username}</span>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() =>
                      handleFieldEdit("username", user?.username || "")
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="flex items-center">
                  <span className="mr-4">{user?.email}</span>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() => handleFieldEdit("email", user?.email || "")}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <Label className="text-sm font-medium text-gray-700">
                  Telefone
                </Label>
                <div className="flex items-center">
                  <span className="mr-4">{user?.phone || "-"}</span>
                  <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() => handleFieldEdit("phone", user?.phone || "")}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-6">
            <form
              className="space-y-4 max-w-xl"
              onSubmit={handleSubmit(onPasswordChangeSubmit)}
            >
              <div>
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Esqueceu sua senha?"
                  {...register("currentPassword")}
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Mostrar senha (Alt + F6)
                </p>
              </div>

              <div>
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirme nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </div>
        )}

        {/* Session History Tab */}
        {activeTab === "session-history" && (
          <div className="p-6">
            {loadingSessions ? (
              <div className="animate-pulse space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dispositivo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Local
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        IP
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hora
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions?.map((session) => {
                      const date = new Date(session.timestamp);
                      return (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.device}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.location || "Desconhecido"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {date.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {date.toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary hover:text-primary-dark">
                              Sair
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
