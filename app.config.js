export default {
  expo: {
    name: "Revision App",
    slug: "Revision-App",
    jsEngine: "hermes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/640px-Book-icon-bible.png",
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
        foregroundImage: "./assets/640px-Book-icon-bible.png",
        backgroundColor: "#000000"
      },
      package: "com.reece437.test"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
    	eas: {
    		projectId: "27748628-ff7e-4da7-b716-6b85587951a9" 
    	}
    }
  }
}
