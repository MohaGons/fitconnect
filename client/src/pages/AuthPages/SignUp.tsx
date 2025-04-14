import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Inscription | FitConnect - Votre partenaire fitness personnel"
        description="Créez votre compte FitConnect pour commencer votre parcours fitness personnalisé et accéder à nos programmes d'entraînement exclusifs."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
