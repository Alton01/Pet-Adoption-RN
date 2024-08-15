import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import UserItem from "../../components/Inbox/UserItem";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && getUserList();
  }, [user]);

  // FOR GETTING USER LISTS
  const getUserList = async () => {
    setLoader(true);
    setUserList([]);
    const q = query(
      collection(db, "Chat"),
      where(
        "userIds",
        "array-contains",
        user?.primaryEmailAddress?.emailAddress
      )
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setUserList((prevList) => [...prevList, doc.data()]);
    });
    setLoader(false);
  };

  //FILTER THE LIST OF OTHER USERS
  const mapOtherUserList = () => {
    const list = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(
        (user) => user?.email != user?.primaryEmailAddress?.emailAddress
      );
      const result = {
        docId: record.id,
        ...otherUser[0],
      };
      list.push(result);
    });
    return list;
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 25,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Inbox
        </Text>

        <FlatList
          refreshing={loader}
          onRefresh={getUserList}
          data={mapOtherUserList()}
          renderItem={({ item, index }) => (
            <UserItem userInfo={item} key={index} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
