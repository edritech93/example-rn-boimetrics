import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

export default function App() {
  return (
    <View>
      <Text>App</Text>
      <TouchableOpacity
        onPress={async () => {
          // Verify user credentials before asking them to enable Face ID
          const {userId} = await verifyUserCredentials();

          const rnBiometrics = new ReactNativeBiometrics();

          const {available, biometryType} =
            await rnBiometrics.isSensorAvailable();

          if (available && biometryType === BiometryTypes.FaceID) {
            Alert.alert(
              'Face ID',
              'Would you like to enable Face ID authentication for the next time?',
              [
                {
                  text: 'Yes please',
                  onPress: async () => {
                    const {publicKey} = await rnBiometrics.createKeys();

                    // `publicKey` has to be saved on the user's entity in the database
                    await sendPublicKeyToServer({userId, publicKey});

                    // save `userId` in the local storage to use it during Face ID authentication
                    await AsyncStorage.setItem('userId', userId);
                  },
                },
                {text: 'Cancel', style: 'cancel'},
              ],
            );
          }
        }}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Sign in</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
