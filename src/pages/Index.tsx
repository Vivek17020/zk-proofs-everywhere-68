import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import TabNavigation from "@/components/TabNavigation";
import HomeScreen from "@/components/screens/HomeScreen";
import ProofsScreen from "@/components/screens/ProofsScreen"; 
import EventsScreen from "@/components/screens/EventsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('zkpresence-onboarding-completed');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('zkpresence-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'proofs':
        return <ProofsScreen />;
      case 'events':
        return <EventsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen">
        {renderActiveScreen()}
      </main>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
