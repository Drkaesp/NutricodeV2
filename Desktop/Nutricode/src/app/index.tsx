import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { getUsers, hashPassword, saveCurrentUser } from '@/src/utils/storage';
import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'erro' | 'sucesso' | '' }>({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin() {
    setMensagem({ texto: '', tipo: '' });

    if (!email || !senha) {
      setMensagem({ texto: 'Preencha todos os campos.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const users = await getUsers();
      const senhaHash = await hashPassword(senha);
      const foundUser = users.find(
        (u: any) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.senhaHash === senhaHash
      );

      if (!foundUser) {
        setMensagem({ texto: 'Email ou senha incorretos.', tipo: 'erro' });
        setLoading(false);
        return;
      }

      await login(foundUser);
      setMensagem({ texto: 'Login realizado com sucesso!', tipo: 'sucesso' });
      setTimeout(() => router.replace('/(panel)/home/page' as any), 800);
    } catch (err) {
      console.error(err);
      setMensagem({ texto: 'Erro ao tentar logar. Tente novamente.', tipo: 'erro' });
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Logo & Mascot */}
          <View style={styles.logoArea}>
            <View style={styles.mascotGlow}>
              <Image
                source={require('@/assets/images/mascoteLogin.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.logoText}>
              Nutri<Text style={styles.logoAccent}>Code</Text>
            </Text>
            <Text style={styles.subtitle}>
              Seu parceiro de treino gamificado 💪
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Senha"
                placeholderTextColor={Colors.textMuted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                style={styles.eyeButton}>
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {mensagem.texto ? (
              <View style={[styles.messageBox, mensagem.tipo === 'erro' ? styles.messageError : styles.messageSuccess]}>
                <Ionicons
                  name={mensagem.tipo === 'erro' ? 'alert-circle' : 'checkmark-circle'}
                  size={16}
                  color={mensagem.tipo === 'erro' ? Colors.statusError : Colors.statusSuccess}
                />
                <Text style={[styles.messageText, { color: mensagem.tipo === 'erro' ? Colors.statusError : Colors.statusSuccess }]}>
                  {mensagem.texto}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color={Colors.textOnAccent} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/(auth)/signup/page')}
              activeOpacity={0.7}>
              <Text style={styles.signupText}>
                Não possui uma conta?{' '}
                <Text style={styles.signupAccent}>Cadastrar</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mascotGlow: {
    borderRadius: 100,
    padding: 4,
    backgroundColor: 'rgba(244, 162, 97, 0.1)',
    marginBottom: 12,
  },
  logoImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  logoText: {
    ...Typography.h1,
    color: Colors.brandGreen,
    fontSize: 32,
  },
  logoAccent: {
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 6,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  messageError: {
    backgroundColor: Colors.statusError + '15',
  },
  messageSuccess: {
    backgroundColor: Colors.statusSuccess + '15',
  },
  messageText: {
    ...Typography.caption,
    flex: 1,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Colors.brandAccent,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: Colors.brandAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    ...Typography.button,
    color: Colors.textOnAccent,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  signupText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signupAccent: {
    color: Colors.brandAccent,
    fontWeight: '700',
  },
});
