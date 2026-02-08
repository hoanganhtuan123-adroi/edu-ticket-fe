import LoginForm from "@/components/client/auth/LoginForm";
import LoginLeftPanel from "@/components/client/auth/LoginLeftPanel";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="login-container w-full max-w-6xl flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
        <LoginLeftPanel />
        <LoginForm />
      </div>
    </div>
  );
}
