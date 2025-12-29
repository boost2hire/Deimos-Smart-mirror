import SmartMirror from "@/components/smart-mirror/SmartMirror";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Lumi Smart Mirror | Voice-Activated Dashboard</title>
        <meta name="description" content="A beautiful smart mirror dashboard with weather, time, schedule, and voice assistant features." />
      </Helmet>
      <SmartMirror />
    </>
  );
};

export default Index;
