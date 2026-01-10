import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { useProductsQuery } from '@/api';
import { ImagePayload, useAddProductMutation } from '@/api/useAddProductMutation';
import { Text, View } from '@/components/Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function ModalScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expiredAt, setExpiredAt] = useState('');
  const [imageFile, setImageFile] = useState<ImagePayload | null>(null);

  const { refetch } = useProductsQuery();
  const { mutate: addProduct } = useAddProductMutation();

  const handleAddProduct = () => {
    if (!name || !description || !expiredAt || !imageFile) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    addProduct(
      { id: uuidv4(), name, description, expired_at: expiredAt, imageFile },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Product added successfully!');
          setName('');
          setDescription('');
          setExpiredAt('');
          setImageFile(null);
          refetch();
        },
        onError: (error) => {
          Alert.alert('Error', 'Failed to add product.' + error.message,);
        },
      }
    );
  };

  const handleDateChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (selected) {
      setExpiredAt(selected.toISOString());
    }
  };

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const response = await fetch(result.assets[0].uri);
  //     const blob = await response.blob();
  //     const file = new File([blob], 'image.jpg', { type: blob.type });
  //     setImageFile(file);
  //   }
  // };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      setImageFile({
        buffer: arrayBuffer,
        name: asset.fileName ?? 'image.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
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
      <DateTimePicker
        value={expiredAt ? new Date(expiredAt) : new Date()}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
      <TouchableOpacity onPress={pickImage} style={styles.submitButton}>
        <Text>Pick an Image</Text>
      </TouchableOpacity>
      {imageFile && <Text>Selected Image: {imageFile.name}</Text>}
      <TouchableOpacity onPress={handleAddProduct} style={styles.submitButton}>
        <Text>Add Product</Text>
      </TouchableOpacity>
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
