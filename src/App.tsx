import { ReactFlowProvider } from "reactflow";
import StrategyCanvas from "./components/StrategyCanvas";
import WalletPanel from "./components/WalletPanel";
import PresetSidebar from "./components/PresetSidebar";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <PresetSidebar />
      <div className="flex flex-col flex-1">
        <WalletPanel />
        <ReactFlowProvider>
          <StrategyCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
} 