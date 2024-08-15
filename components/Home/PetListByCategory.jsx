import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  const getPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setPetList((petList) => [...petList, doc.data()]);
    });
    setLoader(false);
  };

  useEffect(() => {
    getPetList("Wolf");
  }, []);

  return (
    <View>
      <Category category={(value) => getPetList(value)} />
      <FlatList
        data={petList}
        horizontal
        refreshing={loader}
        onRefresh={() => getPetList("Wolf")}
        renderItem={({ item, index }) => <PetListItem pet={item} />}
      />
    </View>
  );
}
