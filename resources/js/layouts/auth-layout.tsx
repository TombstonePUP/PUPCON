import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
// import { LoginForm } from "@/layouts/auth/auth-splitCard-layout"
export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
        // <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        //     <div className="w-full max-w-sm md:max-w-3xl">
        //         <LoginForm />
        //     </div>
        // </div>
    );
}
