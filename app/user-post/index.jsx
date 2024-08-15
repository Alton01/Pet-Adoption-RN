import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });
    user && getUserPost();
  }, [user]);

  const getUserPost = async () => {
    setLoader(true);
    setUserPostList([]);
    const q = query(
      collection(db, "Pets"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setUserPostList((prev) => [...prev, doc.data()]);
    });
    setLoader(false);
  };

  const deletPost = async (docId) => {
    await deleteDoc(doc(db, "Pets", docId));
    getUserPost();
  };

  const onDeletePost = (docId) => {
    Alert.alert(
      "Do You Want To Delete?",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Click"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletPost(docId),
        },
      ]
    );
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          {user?.fullName}'s Post
        </Text>
        <FlatList
          data={userPostList}
          numColumns={2}
          refreshing={loader}
          onRefresh={getUserPost}
          renderItem={({ item, index }) => (
            <View key={index}>
              <PetListItem pet={item} key={index} />
              <Pressable
                onPress={() => onDeletePost(item?.id)}
                style={styles.deleteButton}
              >
                <Text style={{ fontFamily: "outfit", textAlign: "center" }}>
                  Delete
                </Text>
              </Pressable>
            </View>
          )}
        />

        {userPostList?.length == 0 && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "outfit-medium",
                fontSize: 30,
                marginTop: "60%",
                color: Colors.PRIMARY,
              }}
            >
              No Post's Yet
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.RED,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
});
