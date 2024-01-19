import React, { useRef, useState, useEffect } from "react";

import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import { Icon } from "@rneui/themed";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const FadeOutView = (props) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [jsonData, setJsonData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [CV, setCV] = useState(true);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  async function handleBarCodeScanned({ data }) {
    setScanned(true);

    try {
      const response = await axios.post("API LINK" + data);
      const delegateData = response.data.delegate;

      setJsonData(delegateData);
    } catch (error) {
      setJsonData(false);
    }

    setModalVisible(true);
    setTimeout(() => {
      setCV(false);
    }, 1000);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned === false ? (
        <View style={styles.container}>
          <Text style={[styles.title]}>SW BKY Scanner</Text>
          <FadeInView>
            <BarCodeScanner
              style={styles.camera}
              onBarCodeScanned={scanned ? null : handleBarCodeScanned}
              barCodeTypes={BarCodeScanner.Constants.BarCodeType.qr}
            />
          </FadeInView>
        </View>
      ) : (
        <View>
          <Text style={[styles.title]}>SW BKY Scanner</Text>
          {scanned && (
            <TouchableOpacity
              style={[styles.closeButtonStatic]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonStyle}>RESCAN</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {jsonData?.registration_status === "Not Registered" ||
            jsonData?.registration_status === "Not Attending" ? (
              <View>
                <Icon
                  name="warning"
                  type="font-awesome"
                  color="#f50"
                  size={60}
                  containerStyle={styles.icon}
                />
                <Text style={[styles.errorSize, styles.detailsTextStyle]}>
                  Delegate Is Marked {jsonData.registration_status}
                </Text>
                <Pressable
                  style={[styles.closeButtonStatic, styles.buttonOnClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.buttonStyle}>CLOSE</Text>
                </Pressable>
              </View>
            ) : jsonData === false ? (
              <View>
                <Icon
                  name="warning"
                  type="font-awesome"
                  color="#f50"
                  size={60}
                  containerStyle={styles.icon}
                />
                <Text style={[styles.errorSize, styles.detailsTextStyle]}>
                  Delegate Is Not Found!
                </Text>
                <Pressable
                  style={[styles.closeButtonStatic, styles.buttonOnClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.buttonStyle}>CLOSE</Text>
                </Pressable>
              </View>
            ) : jsonData?.registration_status === "Pending Liability Form" ? (
              <View>
                <Icon
                  name="exclamation-circle"
                  type="font-awesome"
                  color="gold"
                  size={60}
                  containerStyle={styles.icon}
                />
                <Text style={[styles.detailsTextStyle]}>
                  Sign Liability Form!
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Check-In Status: {jsonData.check_in_status}
                </Text>

                <Pressable
                  style={[styles.closeButtonStatic, styles.buttonOnClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.buttonStyle}>Close</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Icon
                  name="check-circle"
                  type="font-awesome"
                  color="green"
                  size={60}
                  containerStyle={styles.icon}
                />
                <Text style={[styles.detailsTextStyle]}>
                  Name: {jsonData.first_name} {jsonData.last_name}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  BKMS-ID: {jsonData.id}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Center: {jsonData.center}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Seva: {jsonData.seva}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Rooming: {jsonData.accommodation}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Room: {jsonData?.room ?? "Pending"}
                </Text>
                <Text style={styles.detailsTextStyle}>
                  Check-In Status: Complete
                </Text>

                <Pressable
                  style={[styles.closeButtonStatic, styles.buttonOnClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.buttonStyle}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },

  errorSize: {
    fontSize: 14.6,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4faff",
  },

  camera: {
    overflow: "hidden",
    borderRadius: 30,
    width: 300,
    height: 300,
  },

  closeButtonStatic: {
    width: "auto",
    padding: 10,
    margin: 10,
    backgroundColor: "#5ba467",
    borderRadius: 20,
  },

  icon: {
    marginBottom: 20,
  },
  buttonOnClose: {
    backgroundColor: "#2196F3",
  },
  buttonStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  detailsTextStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    margin: 2,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
