import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

export default function Home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20, marginTop: 20 }}>
          <Header />
          <Slider />
          <PetListByCategory />
          <Link href={"/add-new-pet"} style={styles.addNewPetContainer}>
            <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
            <Text
              style={{
                fontFamily: "outfit-medium",
                color: Colors.PRIMARY,
                fontSize: 18,
                marginLeft: 4,
              }}
            >
              Add New Pet
            </Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
  },
});
