import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  const getSliders = async () => {
    setSliderList([]);
    const snapshot = await getDocs(collection(db, "Sliders"));
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  useEffect(() => {
    getSliders();
  }, []);
  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        data={sliderList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles?.sliderImage}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.8,
    height: 220,
    borderRadius: 15,
    marginRight: 15,
    objectFit: "cover",
  },
});
