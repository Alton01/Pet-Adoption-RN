import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();
  const Menu = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "add-new-pet",
    },
    {
      id: 2,
      name: "My Posts",
      icon: "bookmark",
      path: "/user-post",
    },
    {
      id: 3,
      name: "Favorites",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 4,
      name: "Inbox",
      icon: "chatbubble",
      path: "/(tabs)/inbox",
    },
    {
      id: 5,
      name: "Logout",
      icon: "exit",
      path: "logout",
    },
  ];

  const onPressMenu = (menu) => {
    if (menu == "logout") {
      signOut();
      return;
    }

    router.push(menu.path);
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 10, marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          Profile
        </Text>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 80, height: 80, borderRadius: 99 }}
          />
          <Text
            style={{ fontFamily: "outfit-bold", fontSize: 20, marginTop: 10 }}
          >
            {" "}
            {user?.fullName}{" "}
          </Text>
          <Text
            style={{ fontFamily: "outfit", fontSize: 16, color: Colors.GRAY }}
          >
            {" "}
            {user?.primaryEmailAddress?.emailAddress}{" "}
          </Text>
        </View>

        <FlatList
          data={Menu}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onPressMenu(item)}
              key={item.id}
              style={{
                marginVertical: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: Colors.WHITE,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Ionicons
                name={item?.icon}
                size={30}
                color={Colors.PRIMARY}
                style={{
                  padding: 10,
                  backgroundColor: Colors.LIGHT_PRIMARY,
                  borderRadius: 10,
                }}
              />
              <Text style={{ fontFamily: "outfit", fontSize: 20 }}>
                {" "}
                {item?.name}{" "}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
