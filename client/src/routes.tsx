import { Route, Switch, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import OrganizationSetup from "@/pages/organization-setup";
import InviteMembers from "@/pages/invite-members";
import Board from "@/pages/board";
import DetailedBoard from "@/pages/detailed-board";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path?: string;
}

function PrivateRoute({ component, ...rest }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-stripes">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} component={component} />;
}

export function AppRoutes() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <PrivateRoute path="/organization-setup" component={OrganizationSetup} />
      <PrivateRoute path="/invite-members" component={InviteMembers} />

      {/* App Routes */}
      <PrivateRoute path="/" component={Dashboard} />
      <PrivateRoute path="/tasks" component={Board} />
      <PrivateRoute path="/boards/:id" component={DetailedBoard} />
      <PrivateRoute path="/profile" component={Profile} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}
