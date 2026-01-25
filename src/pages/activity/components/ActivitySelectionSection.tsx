import { motion } from "framer-motion";
import { ActivityType } from "../types";
import { cn } from "@/utils";

interface ActivitySelectionSectionProps {
  epoch: number;
  selectedActivity: ActivityType | null;
  onActivitySelect: (activity: ActivityType) => void;
}

const ACTIVITY_TYPES: ActivityType[] = ["Trade", "Transfer", "Airdrop"];

const ActivitySelectionSection: React.FC<ActivitySelectionSectionProps> = ({
  epoch,
  selectedActivity,
  onActivitySelect,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -50, width: 0 }}
      animate={{ opacity: 1, x: 0, width: "320px" }}
      exit={{ opacity: 0, x: -50, width: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1], // Classic ease-in-out cubic bezier
        opacity: { duration: 0.3 }
      }}
      className="flex min-w-[320px] flex-col border-r border-border bg-card overflow-hidden h-full relative z-5"
    >
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Activity
        </h2>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col p-3 gap-3">
          {ACTIVITY_TYPES.map((activity) => {
            const isSelected = selectedActivity === activity;

            return (
              <motion.button
                key={activity}
                onClick={() => onActivitySelect(activity)}
                initial={false}
                className={cn(
                  "group relative flex items-center justify-center rounded-md px-4 py-8 text-center transition-all duration-200 min-h-[100px]",
                  "hover:bg-muted/30",
                  isSelected
                    ? "bg-muted/20 text-foreground border-2 border-primary shadow-sm"
                    : "text-foreground border-2 border-border hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Epoch Ribbon - Triangular badge in upper left */}
                <div className="absolute left-0 top-0 z-10 overflow-hidden">
                  <div 
                    className="relative w-[40px] h-[40px]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)"
                    }}
                  >
                    <div className="absolute inset-0 bg-primary" />
                    <span className="absolute left-[4px] top-[4px] text-[11px] font-bold text-primary-foreground leading-tight">
                      {epoch}
                    </span>
                  </div>
                </div>

                {/* Activity Name */}
                <span className="text-base font-semibold uppercase tracking-wider">
                  {activity}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default ActivitySelectionSection;
