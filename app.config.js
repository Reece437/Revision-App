export default {
  expo: {
    name: "Revision App",
    slug: "Revision-App",
    jsEngine: "hermes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/download.jpg",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/download.jpg",
        backgroundColor: "#000000"
      },
      package: "com.reece437.test"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
  }
}
