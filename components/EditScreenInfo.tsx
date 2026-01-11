import { Entypo } from '@expo/vector-icons';
import { differenceInDays, format } from 'date-fns';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet } from 'react-native';

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
  const { mutate: deleteProductById, isPending: isDeletionInProgress } = useDeleteProductMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            setDeletingId(id);
            try {
              await deleteProductById(id);
              await refetch();
            } finally {
              setDeletingId(null);
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (Array.isArray(data) && data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.emptyThumbnail}
        />
        <Text style={styles.emptyText}>No products found</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.getStartedContainer}>
        {data?.map((product) => {
          const isItemDeleting = deletingId === product.id && isDeletionInProgress
          return (
          <View key={product.id} style={[styles.productContainer, isItemDeleting&& styles.productDeleting]}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Entypo
                name="cross"
                size={24}
                color="#FF7F7F"
                onPress={() => handleDelete(product.id)}
                disabled={isItemDeleting}
              />
            </View>
            {product.image_url ? (
              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productDate}>Created: {format(new Date(product.created_at), 'dd/MM/yyyy')}</Text>
            <Text
              style={[styles.productDate, getExpiryStyle(differenceInDays(new Date(product.expired_at), new Date()))]}
            >
              {getExpiryText(differenceInDays(new Date(product.expired_at), new Date()))}
            </Text>
          </View>
        )})}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  emptyThumbnail: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
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
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
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
  productDeleting: {
    opacity: 0.5,
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
