import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { useProductsQuery } from '@/api';
import { useAddProductMutation } from '@/api/useAddProductMutation';
import { Text, View } from '@/components/Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function ModalScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expiredAt, setExpiredAt] = useState('');

  const { refetch } = useProductsQuery();
  const { mutate: addProduct } = useAddProductMutation();

  const handleAddProduct = () => {
    if (!name || !description || !expiredAt) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    addProduct(
      { id: uuidv4(), name, description, expired_at: expiredAt },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Product added successfully!');
          setName('');
          setDescription('');
          setExpiredAt('');
          refetch();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to add product.');
        },
      }
    );
  };

  const handleDateChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (selected) {
      setExpiredAt(selected.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      {/* <Button title="Select Expiry Date" onPress={() => setShowDatePicker(true)} /> */}
      {/* {showDatePicker && ( */}
      <DateTimePicker
        value={expiredAt ? new Date(expiredAt) : new Date()}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
      {/* )} */}
      <TouchableOpacity onPress={handleAddProduct} style={styles.submitButton}>
        <Text>Add Product</Text>
      </TouchableOpacity>
      {/* <Text style={styles.input}>Selected Date: {expiredAt ? new Date(expiredAt).toLocaleDateString() : 'None'}</Text> */}
      {/* <Button title="Add Product" onPress={handleAddProduct} style={styles.submitButton} /> */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
