import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../firebase/firebaseConfig'; // doğru yolu yaz
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const GoalsScreen = () => {
  const [goalText, setGoalText] = useState('');
  const [goals, setGoals] = useState([]);

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  // Hedefleri Firestore'dan dinle
  useEffect(() => {
    if (!user) return;

    const goalsRef = collection(db, 'users', user.uid, 'goals');

    const unsubscribe = onSnapshot(goalsRef, snapshot => {
      const fetchedGoals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(fetchedGoals);
    });

    return () => unsubscribe();
  }, [user]);

  // Hedef ekle
  const addGoal = async () => {
    if (!goalText.trim()) return;
    try {
      const goal = {
        text: goalText,
        completed: false,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'users', user.uid, 'goals'), goal);
      setGoalText('');
    } catch (err) {
      console.error('Hedef eklenirken hata:', err);
    }
  };

  // Tamamlandı/iptal et
  const toggleComplete = async (id, currentStatus) => {
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await updateDoc(goalRef, { completed: !currentStatus });
    } catch (err) {
      console.error('Tamamlama güncellenemedi:', err);
    }
  };

  // Hedef sil
  const deleteGoal = async (id) => {
    try {
      const goalRef = doc(db, 'users', user.uid, 'goals', id);
      await deleteDoc(goalRef);
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Yeni Hedef Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Hedefini yaz..."
        value={goalText}
        onChangeText={setGoalText}
      />
      <Button title="Hedefi Ekle" onPress={addGoal} />

      <Text style={styles.title}>✅ Hedeflerim</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)}>
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={24}
                color={item.completed ? '#4CAF50' : '#ccc'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            <Text style={[styles.goalText, item.completed && styles.completed]}>
              {item.text}
            </Text>

            <TouchableOpacity onPress={() => deleteGoal(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: 16,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default GoalsScreen;
