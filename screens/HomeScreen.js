import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import app from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

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
  const [notesList, setNotesList] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const saveNoteToFirestore = async () => {
    if (!note.trim()) return;
    if (!user) {
      alert('Kullanıcı oturumu açık değil!');
      return;
    }

    const userNotesRef = collection(db, 'users', user.uid, 'notes');

    try {
      if (editingNoteId) {
        const noteRef = doc(db, 'users', user.uid, 'notes', editingNoteId);
        await updateDoc(noteRef, { text: note });
        setEditingNoteId(null);
      } else {
        await addDoc(userNotesRef, {
          text: note,
          createdAt: new Date()
        });
      }
      setNote('');
    } catch (error) {
      console.error('Not ekleme/güncelleme hatası:', error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const noteRef = doc(db, 'users', user.uid, 'notes', noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Not silinemedi:', error);
    }
  };

  const editNote = (noteId, currentText) => {
    setNote(currentText);
    setEditingNoteId(noteId);
  };

  useEffect(() => {
    if (!user) return;

    const userNotesRef = collection(db, 'users', user.uid, 'notes');
    const q = query(userNotesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotesList(notes);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <FlatList
      data={notesList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.noteItem}>
          <Text style={styles.noteText}>{item.text}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => editNote(item.id, item.text)}>
              <Ionicons name="create-outline" size={20} color="#007AFF" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Ionicons name="trash-outline" size={20} color="red" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>📜 Günün Sözü</Text>
          <Text style={styles.quote}>{quote}</Text>
          <Button title="Yeni Söz" onPress={getRandomQuote} />

          <Text style={styles.title}>📝 Note of the Day</Text>
          <TextInput
            placeholder="Write yourself a note..."
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.input}
          />
          <Button
            title={editingNoteId ? 'Update Note' : 'Save Note'}
            onPress={saveNoteToFirestore}
            color={editingNoteId ? '#f39c12' : undefined}
          />

          <Text style={styles.title}>🗂 Saved Notes</Text>
        </View>
      }
      ListFooterComponent={
        <View style={styles.videoContainer}>
          <Text style={styles.title}>🎥 Video of the Day</Text>
          <WebView
            source={{ uri: 'https://www.youtube.com/embed/ZXsQAXx_ao0' }}
            style={{ height: 200 }}
          />
        </View>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  quote: { fontSize: 16, fontStyle: 'italic', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    height: 100, textAlignVertical: 'top', marginBottom: 10,
  },
  videoContainer: {
    marginTop: 20, paddingHorizontal: 16, borderRadius: 8, overflow: 'hidden',
  },
  noteItem: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 15,
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default HomeScreen;
