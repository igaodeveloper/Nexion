import { useLocation } from "wouter";
import { AuthLayout } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertOrganizationSchema,
  type InsertOrganization,
} from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationSetupPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsertOrganization>({
    resolver: zodResolver(insertOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      createdBy: 0, // Will be set by the server
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: InsertOrganization) => {
      const response = await apiRequest("POST", "/api/organizations", data);
      return response.json();
    },
    onSuccess: () => {
      setLocation("/invite-members");
    },
    onError: (error) => {
      toast({
        title: "Organization setup failed",
        description:
          error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertOrganization) => {
    // createdBy will be set by the server based on the session
    createOrgMutation.mutate(data);
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-center mb-4">
        Vamos fazer o setup da sua organização
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Nome da sua organização</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descreva sua organização</Label>
          <Textarea
            id="description"
            rows={3}
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#FF3BA5] hover:bg-[#FF559F] text-white"
          disabled={createOrgMutation.isPending}
        >
          {createOrgMutation.isPending ? "Criando..." : "Continuar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
