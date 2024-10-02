import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Shared from "../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function Favorite() {
  const { user } = useUser();

  const [favIds, setFavIds] = useState([]);

  const [favPetList, setFavPetList] = useState([]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && getFavPetIds();
  }, [user]);

  const getFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.getFavList(user);
    setFavIds(result?.favorites);
    setLoader(false);
    getFavPetList(result?.favorites);
  };

  const getFavPetList = async (favId_) => {
    setLoader(true);
    setFavPetList([]);
    const q = query(collection(db, "Pets"), where("id", "in", favId_));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setFavPetList((prev) => [...prev, doc.data()]);
    });

    setLoader(false);
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 10, marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Favorites
        </Text>
        <FlatList
          numColumns={2}
          onRefresh={getFavPetIds}
          refreshing={loader}
          data={favPetList}
          renderItem={({ item, index }) => (
            <View key={index}>
              <PetListItem pet={item} key={index} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
