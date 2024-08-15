import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../Config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export default function AddNewPet() {
  const { user } = useUser();
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    category: "Wolf",
    sex: "Male",
  });
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
    getCategories();
  }, []);

  const getCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const imagePicker = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = () => {
    if (Object.keys(formData).length != 8) {
      ToastAndroid.show("Enter All Details", ToastAndroid.SHORT);
      return;
    }
    uploadImage();
  };

  const uploadImage = async () => {
    setLoader(true);
    const resp = await fetch(image);
    const blobImage = await resp.blob();
    const storageRef = ref(storage, "/adopt-pet/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blobImage)
      .then((snapshot) => {
        console.log("File Uploaded");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          saveFormData(downloadUrl);
        });
      });
  };

  const saveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      username: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId,
    });
    setLoader(false);
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 24,
              textAlign: "center",
            }}
          >
            Add New Pet for Adoption
          </Text>

          <Pressable onPress={imagePicker}>
            {!image ? (
              <Image
                source={require("./../../assets/placeholder.png")}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 15,
                  borderWidth: 2,
                  borderColor: Colors.GRAY,
                  marginTop: 20,
                }}
              />
            ) : (
              <Image
                source={{ uri: image }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 15,
                  marginTop: 20,
                }}
              />
            )}
          </Pressable>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pet Category *</Text>
            <Picker
              style={styles.input}
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCategory(itemValue);
                handleInputChange("category", itemValue);
              }}
            >
              {categoryList.map((category, index) => (
                <Picker.Item
                  key={index}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleInputChange("breed", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleInputChange("age", value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender *</Text>
            <Picker
              style={styles.input}
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                handleInputChange("sex", itemValue);
              }}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight *</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleInputChange("weight", value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleInputChange("address", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>About *</Text>
            <TextInput
              style={styles.input}
              numberOfLines={5}
              multiline={true}
              onChangeText={(value) => handleInputChange("about", value)}
            />
          </View>

          <TouchableOpacity
            disabled={loader}
            onPress={onSubmit}
            style={styles.button}
          >
            {loader ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Text
                style={{ fontFamily: "outfit-medium", textAlign: "center" }}
              >
                Add Pet
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 30,
  },
});
