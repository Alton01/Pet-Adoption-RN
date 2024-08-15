import { View, Text, Image, Pressable, ScrollView } from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", {
            scheme: "adopt-pet",
          }),
        });

      if (createdSessionId) {
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: Colors.WHITE, height: "100%" }}>
          <Image
            source={require("./../../assets/images/login.png")}
            style={{ width: "100%", height: 450 }}
          />
          <View
            style={{
              padding: 20,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 30,
                textAlign: "center",
              }}
            >
              Ready to meet your new friend?
            </Text>
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 18,
                textAlign: "center",
                color: Colors.GRAY,
                marginTop: 20,
              }}
            >
              Lets adopt the pet which you love and make their life happy.
            </Text>
            <Pressable
              onPress={onPress}
              style={{
                padding: 14,
                marginTop: 80,
                backgroundColor: Colors.PRIMARY,
                width: "100%",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
