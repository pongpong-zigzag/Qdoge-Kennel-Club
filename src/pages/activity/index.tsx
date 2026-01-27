import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";
import { AnimatePresence } from "framer-motion";
import EpochSelectionSection from "./components/EpochSelectionSection";
import ActivitySelectionSection from "./components/ActivitySelectionSection";
import DisplaySection from "./components/DisplaySection";
import { ActivityType } from "./types";

const Activity: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [expandedEpochs, setExpandedEpochs] = useState<Set<number>>(new Set());

  // Get current epoch from tickInfo or use a default range
  const currentEpoch = tickInfo?.epoch || 198;
  
  // Generate list of epochs (current and previous ones)
  const epochs = useMemo(() => {
    const epochList: number[] = [];
    const startEpoch = Math.max(1, currentEpoch - 10); // Show last 11 epochs
    for (let i = currentEpoch; i >= startEpoch; i--) {
      epochList.push(i);
    }
    return epochList;
  }, [currentEpoch]);

  // Handle epoch selection - only one epoch can be expanded at a time
  const handleEpochSelect = (epoch: number) => {
    if (selectedEpoch === epoch) {
      // If clicking on the already selected epoch, collapse it
      setExpandedEpochs(new Set());
      setSelectedEpoch(null);
      setSelectedActivity(null);
    } else {
      // Select new epoch - collapse previous one and expand new one
      setExpandedEpochs(new Set([epoch]));
      setSelectedEpoch(epoch);
      setSelectedActivity(null); // Reset activity when epoch changes
    }
  };

  // Handle activity selection
  const handleActivitySelect = (activity: ActivityType) => {
    setSelectedActivity(activity);
  };

  return (
    <main className="relative isolate flex min-h-[calc(100vh-140px)] w-full bg-background overflow-hidden">
      <div className="flex w-full h-full">
        {/* Section 1: Epoch Selection */}
        <EpochSelectionSection
          epochs={epochs}
          selectedEpoch={selectedEpoch}
          expandedEpochs={expandedEpochs}
          onEpochSelect={handleEpochSelect}
        />

        {/* Section 2: Activity Selection */}
        <AnimatePresence mode="wait">
          {selectedEpoch && (
            <ActivitySelectionSection
              key={selectedEpoch}
              epoch={selectedEpoch}
              selectedActivity={selectedActivity}
              onActivitySelect={handleActivitySelect}
            />
          )}
        </AnimatePresence>

        {/* Section 3: Display Section */}
        <AnimatePresence mode="wait">
          {selectedActivity && selectedEpoch && (
            <DisplaySection
              key={`${selectedEpoch}-${selectedActivity}`}
              epoch={selectedEpoch}
              activity={selectedActivity}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Activity;
