// 受験日までのカウントダウンタイマーを表示するコンポーネントの例
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountdownTimer = ({ examDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(examDate) - +new Date();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft('Time is up!');
        return;
      }
      const timeLeft = new Date(difference).toISOString().substr(11, 8);
      setTimeLeft(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  timer: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default CountdownTimer;
