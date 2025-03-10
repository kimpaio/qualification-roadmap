// 簡単な参考書情報を表示するコンポーネントの例
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookInfo = ({ title, author, isbn }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.isbn}>ISBN: {isbn}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
  },
  isbn: {
    fontSize: 12,
  },
});

export default BookInfo;
