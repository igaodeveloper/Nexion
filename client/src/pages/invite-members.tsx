import { useLocation } from "wouter";
import { AuthLayout } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inviteMemberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extend the schema to handle multiple invites
const inviteMembersSchema = z.object({
  invite1: inviteMemberSchema.shape.email,
  invite2: inviteMemberSchema.shape.email.optional(),
});

type InviteMembersData = z.infer<typeof inviteMembersSchema>;

export default function InviteMembersPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<InviteMembersData>({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      invite1: "",
      invite2: ""
    }
  });
  
  const inviteMembersMutation = useMutation({
    mutationFn: async (data: InviteMembersData) => {
      // Get the organization ID - in a real app, would get the user's current org
      const orgId = 1;
      
      // Send invites
      const invites = [];
      
      if (data.invite1) {
        invites.push(
          apiRequest("POST", `/api/organizations/${orgId}/invite`, { email: data.invite1 })
        );
      }
      
      if (data.invite2) {
        invites.push(
          apiRequest("POST", `/api/organizations/${orgId}/invite`, { email: data.invite2 })
        );
      }
      
      await Promise.all(invites);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Invites sent",
        description: "Your team members have been invited.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to send invites",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: InviteMembersData) => {
    inviteMembersMutation.mutate(data);
  };

  // Skip this step
  const skipStep = () => {
    setLocation("/");
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-center mb-4">Convide até 2 membros para sua organização</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="invite1">Email</Label>
          <Input
            id="invite1"
            type="email"
            {...register("invite1")}
            className={errors.invite1 ? "border-red-500" : ""}
          />
          {errors.invite1 && (
            <p className="text-red-500 text-sm mt-1">{errors.invite1.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="invite2">Email</Label>
          <Input
            id="invite2"
            type="email"
            {...register("invite2")}
            className={errors.invite2 ? "border-red-500" : ""}
          />
          {errors.invite2 && (
            <p className="text-red-500 text-sm mt-1">{errors.invite2.message}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            className="flex-1 bg-[#FF3BA5] hover:bg-[#FF559F] text-white"
            disabled={inviteMembersMutation.isPending}
          >
            {inviteMembersMutation.isPending ? "Enviando..." : "Continuar"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#FF87D4] text-[#FF3BA5] hover:bg-pink-50"
            onClick={skipStep}
          >
            Pular
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
