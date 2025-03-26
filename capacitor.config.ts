
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.69aabda304a14fa58d16cefe97fe5656',
  appName: 'sky-pulse-forecast',
  webDir: 'dist',
  server: {
    url: 'https://69aabda3-04a1-4fa5-8d16-cefe97fe5656.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
