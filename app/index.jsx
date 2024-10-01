import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useRootNavigationState } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user } = useUser();

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    checkNavLoaded();
  }, []);

  const checkNavLoaded = () => {
    if (!rootNavigationState.key) {
      return null;
    }
  };

  return (
    <SafeAreaView>
      <View>
        {user ? (
          <Redirect href={"/(tabs)/home"} />
        ) : (
          <Redirect href={"/login/index"} />
        )}
      </View>
    </SafeAreaView>
  );
}
