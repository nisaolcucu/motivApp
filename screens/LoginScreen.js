import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication importu

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifre girin');
      return;
    }

    const auth = getAuth(); // Auth nesnesini al
    signInWithEmailAndPassword(auth, email, password) // Firebase ile giriş yap
      .then((userCredential) => {
        // Giriş başarılı olduğunda, kullanıcının bilgilerine erişebiliriz
        const user = userCredential.user;
        Alert.alert('Başarılı', `Hoş geldiniz, ${user.displayName || 'Kullanıcı'}!`);
        navigation.replace('MainTabs'); // Başarılı giriş sonrası ana sekmelere yönlendir
      })
      .catch((error) => {
        // Hata durumunda, kullanıcıyı bilgilendir
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Giriş Hatası', `Hata: ${errorMessage}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 6 },
  link: { color: 'blue', marginTop: 16, textAlign: 'center' },
});

export default LoginScreen;
