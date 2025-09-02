import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import UserSignup from "@/components/UserSignup";
import TabNavigation from "@/components/TabNavigation";
import HomeScreen from "@/components/screens/HomeScreen";
import ProofsScreen from "@/components/screens/ProofsScreen"; 
import EventsScreen from "@/components/screens/EventsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('zkpresence-onboarding-completed');
    if (hasCompletedOnboarding && user) {
      setShowOnboarding(false);
      setShowSignup(false);
    } else if (hasCompletedOnboarding && !user && !loading) {
      setShowOnboarding(false);
      setShowSignup(true);
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('zkpresence-onboarding-completed', 'true');
    setShowOnboarding(false);
    if (!user) {
      setShowSignup(true);
    }
  };

  const handleSignupComplete = () => {
    setShowSignup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showSignup) {
    return <UserSignup onComplete={handleSignupComplete} />;
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
