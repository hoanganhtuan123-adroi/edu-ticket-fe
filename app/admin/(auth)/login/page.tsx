import LoginForm from "@/app/components/admin/auth/LoginForm";
import LoginLeftPanel from "@/app/components/admin/auth/LoginLeftPanel";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="login-container w-full max-w-5xl flex flex-col md:flex-row">
        <LoginLeftPanel />
        <LoginForm />
      </div>
    </div>
  );
}
