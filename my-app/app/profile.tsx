import { Redirect } from 'expo-router';
import { useAuth } from '../context/auth_context';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(tabs)" />;
  }
  console.log('profile user', user)

  return (
    // your profile UI here
    <View style={styles.container}>
        <Text style={styles.text}>profile</Text>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#fff',
    },
  });
