import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cz.utb.fai.cryptoguessr',
  appName: 'CryptoGuessr',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 1500,
      // backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      // androidScaleType: "CENTER_CROP",
      showSpinner: false,
      // androidSpinnerStyle: "large",
      // iosSpinnerStyle: "small",
      // spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;
