import { TesteProvider } from "../../context/TesteContext";
import ScreenHome from "../components/screens/Home.jsx";

export default function Home() {
  return (
    <TesteProvider>
      <div className="flex w-full h-full">
        <ScreenHome />
      </div>
    </TesteProvider>
  );
}
