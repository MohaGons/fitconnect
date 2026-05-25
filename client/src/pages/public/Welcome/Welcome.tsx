import FitnessGoalSection from "../../../components/welcome/FitnessGoalSection";
import FitnessServicesSection from "../../../components/welcome/FitnessServicesSection";
import HeroSection from "../../../components/welcome/HeroSection";
import PerfectTrainersBackground from "../../../components/welcome/PerfectTrainersSection";
import Header from "../../../layout/public/Header";

const Welcome :React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <PerfectTrainersBackground />
      <FitnessGoalSection/>
      <FitnessServicesSection/>
    </>
  
  );
};
export default Welcome;