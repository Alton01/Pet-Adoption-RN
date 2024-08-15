import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  const getUserDetails = async () => {
    const docRef = doc(db, "Chat", params?.id);
    const docSnap = await getDoc(docRef);

    const result = docSnap.data();
    const otherUser = result?.users.filter(
      (item) => item.email != user?.primaryEmailAddress?.emailAddress
    );
    navigation.setOptions({
      headerTitle: otherUser[0].name,
    });
  };

  useEffect(() => {
    getUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, "Chat", params?.id, "Messages"),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);
      }
    );
    return () => unsubscribe();
  }, []);

  const onSend = async (newMessage) => {
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, newMessage)
    );
    newMessage[0].createdAt = moment().format("MM-DD-YYYY HH:mm:ss");
    await addDoc(collection(db, "Chat", params.id, "Messages"), newMessage[0]);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
  );
}
