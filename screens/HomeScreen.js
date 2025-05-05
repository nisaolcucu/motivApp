import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const quotes = [
  "Believe in yourself!",
  "You are capable of amazing things.",
  "Every day is a second chance.",
  "Small steps every day.",
  "Stay positive, work hard, make it happen."
];

const HomeScreen = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const [note, setNote] = useState('');

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📜 Günün Sözü</Text>
      <Text style={styles.quote}>{quote}</Text>
      <Button title="Yeni Söz" onPress={getRandomQuote} />

      <Text style={styles.title}>📝 Bugünkü Notun</Text>
      <TextInput
        placeholder="Kendine bir not yaz..."
        value={note}
        onChangeText={setNote}
        multiline
        style={styles.input}
      />

      <Text style={styles.title}>🎥 Bugünün Videosu</Text>
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: 'https://www.youtube.com/embed/ZXsQAXx_ao0' }} // Örnek video
          style={{ height: 200 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
  },
  videoContainer: {
    marginTop: 10,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default HomeScreen;
