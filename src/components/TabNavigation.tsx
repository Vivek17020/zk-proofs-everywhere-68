import { Home, Shield, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'proofs', label: 'My Proofs', icon: Shield },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10 shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}