// app/components/LoginModal.tsx
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/app/context/auth_context';
import ApiService from '../services/api';

export default function LoginModal() {
  const { login_modal_visible, hideLoginModal, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    // Replace with your real API call
    //const fakeToken = 'jwt-token-example';
    const login_response = await ApiService.login(email, password);
    console.log(login_response);
    const token: string = login_response.messages[1];

    console.log('token', token);
    await login(token);
  }

  return (
    <Modal visible={login_modal_visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button title="Login" onPress={handleLogin} />
          <Button title="Cancel" onPress={hideLoginModal} color="#888" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '55%',
    backgroundColor: '#25292e',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
