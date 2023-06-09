import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import * as Location from "expo-location";
import { Linking, Clipboard } from "expo";

const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso de ubicación denegado");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  const generateWhatsAppLink = () => {
    if (location) {
      const { latitude, longitude } = location;
      const message = `¡Hola! Mi ubicación actual es: https://maps.google.com/?q=${latitude},${longitude}`;

      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}`;

      // Copiar el enlace al portapapeles
      Clipboard.setString(url);

      // Abrir WhatsApp
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Obtener Ubicación</Text>

      {location && (
        <Text style={styles.locationText}>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </Text>
      )}
      <Text style={styles.heading}>Ingresa los datos del volcán:</Text>

      <TextInput style={styles.input} placeholder="Nombre del volcán" />
      <TextInput style={styles.input} placeholder="Altura del volcán" />
      <TextInput style={styles.input} placeholder="Tipo (activo/pasivo)" />
      <TextInput style={styles.input} placeholder="Región" />

      <Button
        title="Generar enlace de WhatsApp"
        onPress={generateWhatsAppLink}
        disabled={!location}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default LocationScreen;
