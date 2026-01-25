import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils";

interface EpochSelectionSectionProps {
  epochs: number[];
  selectedEpoch: number | null;
  expandedEpochs: Set<number>;
  onEpochSelect: (epoch: number) => void;
}

const EpochSelectionSection: React.FC<EpochSelectionSectionProps> = ({
  epochs,
  selectedEpoch,
  expandedEpochs,
  onEpochSelect,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-[180px] min-w-[180px] flex-col border-r border-border bg-card h-full relative z-10"
    >
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Epoch
        </h2>
      </div>

      {/* Epoch List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col p-3 gap-2">
          {epochs.map((epoch) => {
            const isSelected = selectedEpoch === epoch;
            const isExpanded = expandedEpochs.has(epoch);

            return (
              <motion.button
                key={epoch}
                onClick={() => onEpochSelect(epoch)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-4 py-3 text-left transition-all duration-200",
                  "hover:bg-muted/40",
                  isSelected
                    ? "bg-muted/20 text-foreground border-2 border-primary shadow-sm"
                    : "text-foreground border-2 border-transparent hover:border-border/50"
                )}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Expand/Collapse Indicator */}
                <div className="flex h-5 w-5 items-center justify-center flex-shrink-0">
                  {isExpanded ? (
                    <Minus size={16} className="text-primary font-bold" />
                  ) : (
                    <Plus size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>

                {/* Epoch Number */}
                <span className="flex-1 font-mono text-base font-semibold">
                  {epoch}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default EpochSelectionSection;
