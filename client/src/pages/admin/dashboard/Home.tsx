import PageMeta from "../../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | FitConnect - Votre partenaire fitness personnel"
        description="Suivez vos progrès, accédez à vos programmes d'entraînement personnalisés et gérez votre planning fitness depuis votre tableau de bord FitConnect."
      />
      <div className="flex items-center justify-center w-full h-screen">
        page d'accueil du tableau de bord
      </div>
    </>
  );
}