import { Entypo } from '@expo/vector-icons';
import { differenceInDays, format } from 'date-fns';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from './Themed';

import { useProductsQuery } from '@/api';
import { useDeleteProductMutation } from '@/api/useDeleteProductMutation';

const getExpiryStyle = (daysLeft: number) => {
  if (daysLeft < 0) return { color: '#0d3b04' };
  if (daysLeft <= 4) return { color: 'red' };
  if (daysLeft <= 7) return { color: '#859906' };
  return { color: '#888' };
};

const getExpiryText = (daysLeft: number) => {
  if (daysLeft < 0) return 'STALE 🤮';
  return `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
};

export default function EditScreenInfo({ path }: { path: string }) {
  const { data, isLoading, refetch } = useProductsQuery(true);
  const { mutate: deleteProductById } = useDeleteProductMutation();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            await deleteProductById(id)
            await refetch()
          }
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView>
      <View style={styles.getStartedContainer}>
        {data?.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Entypo
                name="cross"
                size={24}
                color="#FF7F7F"
                onPress={() => handleDelete(product.id)}
              />
            </View>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productDate}>Created: {format(new Date(product.created_at), 'dd/MM/yyyy')}</Text>
            <Text
              style={[styles.productDate, getExpiryStyle(differenceInDays(new Date(product.expired_at), new Date()))]}
            >
              {getExpiryText(differenceInDays(new Date(product.expired_at), new Date()))}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  productContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  productDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
