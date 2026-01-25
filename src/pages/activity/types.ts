export type ActivityType = "Trade" | "Transfer" | "Airdrop";

export interface ActivityData {
  epoch: number;
  activity: ActivityType;
  items: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  [key: string]: any; // Extensible for different activity types
}
