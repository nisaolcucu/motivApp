import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebaseConfig'; // auth'u config dosyasından al

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'İsimsiz Kullanıcı',
        email: currentUser.email,
        photo: currentUser.photoURL || 'https://www.w3schools.com/w3images/avatar2.png',
      });
    }
  }, []);

  const handleSettings = () => {
    Alert.alert('Ayarlar', 'Ayarlar sayfasına yönlendirilecek.');
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'You will be logged out of the account.', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Done',
        onPress: () => {
          auth.signOut()
            .then(() => {
              navigation.replace('Login');
            })
            .catch((error) => {
              Alert.alert('Hata', error.message);
            });
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.photo }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSettings}>
        <Text style={styles.buttonText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f44336' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>🚪 Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
