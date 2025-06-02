import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Connexion | FitConnect - Votre partenaire fitness personnel"
        description="Connectez-vous à votre compte FitConnect pour accéder à vos programmes d'entraînement personnalisés et suivre vos progrès fitness."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}