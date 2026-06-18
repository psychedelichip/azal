import { ScrollArea } from "@/components/ui/scroll-area";
import { ConcentrationCard } from "./command-center/ConcentrationCard";
import { CorrelationClustersCard } from "./command-center/CorrelationClustersCard";
import { SinglePointsOfFailureCard } from "./command-center/SinglePointsOfFailureCard";
import { ImportedAssetRelevanceCard } from "./command-center/ImportedAssetRelevanceCard";
import { ScenarioStagingCard } from "./command-center/ScenarioStagingCard";

export function CommandCenterTab() {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900">Command Center</h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-5">
          Understand the risk behind your book — concentration, hidden correlation, and single points of failure.
        </p>

        <div className="space-y-5">
          <ConcentrationCard />
          <div className="grid grid-cols-2 gap-5">
            <CorrelationClustersCard />
            <SinglePointsOfFailureCard />
          </div>
          <ImportedAssetRelevanceCard />
          <ScenarioStagingCard />
        </div>
      </div>
    </ScrollArea>
  );
}
