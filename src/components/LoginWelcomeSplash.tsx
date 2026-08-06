import React, { useEffect, useState } from 'react';
import { UserSession } from './LoginPage';

interface LoginWelcomeSplashProps {
  user: UserSession;
  onComplete: () => void;
}

export const LoginWelcomeSplash: React.FC<LoginWelcomeSplashProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Start backdrop fadeout smoothly at 5 seconds, completing total 6 seconds transition
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden transition-all duration-1000 ${
        isFadingOut ? 'bg-slate-950/0 backdrop-blur-none' : 'bg-slate-950/85 backdrop-blur-2xl'
      }`}
    >
      {/* Golden Radial Aura Background */}
      <div className={`absolute w-[700px] h-[700px] bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-yellow-500/15 rounded-full blur-3xl transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* SEAMLESS 6-SECOND LOGO TRANSITION CONTAINER: ZOOM-IN CENTER -> BREATHE -> FLY & ZOOM-OUT TO TOP-LEFT NAVBAR */}
      <div className="relative z-10 flex items-center justify-center">
        <img 
          src="/logo-gunungkidul.svg" 
          alt="Lambang Kabupaten Gunungkidul" 
          className="w-48 h-60 sm:w-56 sm:h-72 object-contain animate-seamless-logo-6s"
        />
      </div>
    </div>
  );
};
