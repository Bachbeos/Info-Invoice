import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "./components/SignUpForm";
import AuthLayout from "./AuthPageLayout";

export default function SignUp() {
    return (
        <>
            <PageMeta
                title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </>
    );
}
