import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
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

export default function SignupScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'erro' | 'sucesso' | '' }>({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSignup() {
    setMensagem({ texto: '', tipo: '' });

    if (!nome || !email || !senha || !confirmarSenha) {
      setMensagem({ texto: 'Preencha todos os campos.', tipo: 'erro' });
      return;
    }
    if (nome.trim().length < 3) {
      setMensagem({ texto: 'O nome deve ter pelo menos 3 caracteres.', tipo: 'erro' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensagem({ texto: 'Digite um email válido.', tipo: 'erro' });
      return;
    }
    if (senha.length < 8) {
      setMensagem({ texto: 'A senha deve ter pelo menos 8 caracteres.', tipo: 'erro' });
      return;
    }
    if (!/\d/.test(senha)) {
      setMensagem({ texto: 'A senha deve conter pelo menos um número.', tipo: 'erro' });
      return;
    }
    if (senha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const sucesso = await register(email, senha, nome);
      if (sucesso) {
        setMensagem({ texto: 'Conta criada com sucesso!', tipo: 'sucesso' });
        setTimeout(() => router.replace('/(auth)/onboarding/page' as any), 1000);
      } else {
        setMensagem({ texto: 'Este email já está cadastrado.', tipo: 'erro' });
      }
    } catch (err: any) {
      setMensagem({ texto: err.message || 'Erro ao criar conta.', tipo: 'erro' });
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/mascoteLogin.png')}
              style={styles.mascot}
            />
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece sua jornada fitness!</Text>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>
          <Text style={styles.stepLabel}>Etapa 1 de 3 — Dados Básicos</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor={Colors.textMuted}
                value={nome}
                onChangeText={setNome}
              />
            </View>

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
                secureTextEntry={!verSenha}
              />
              <TouchableOpacity onPress={() => setVerSenha(!verSenha)} style={styles.eyeBtn}>
                <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirmar Senha"
                placeholderTextColor={Colors.textMuted}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!verConfirmarSenha}
              />
              <TouchableOpacity onPress={() => setVerConfirmarSenha(!verConfirmarSenha)} style={styles.eyeBtn}>
                <Ionicons name={verConfirmarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {mensagem.texto ? (
              <View style={[styles.msgBox, mensagem.tipo === 'erro' ? styles.msgError : styles.msgSuccess]}>
                <Ionicons
                  name={mensagem.tipo === 'erro' ? 'alert-circle' : 'checkmark-circle'}
                  size={16}
                  color={mensagem.tipo === 'erro' ? Colors.statusError : Colors.statusSuccess}
                />
                <Text style={[styles.msgText, { color: mensagem.tipo === 'erro' ? Colors.statusError : Colors.statusSuccess }]}>
                  {mensagem.texto}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Cadastrar'}</Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color={Colors.textOnAccent} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backLink}
              activeOpacity={0.7}>
              <Text style={styles.backText}>
                Já possui uma conta? <Text style={styles.backAccent}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  header: { alignItems: 'center', marginBottom: 20 },
  mascot: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8 },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: 4 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.surfaceCardsLight,
  },
  stepActive: {
    backgroundColor: Colors.brandAccent,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.surfaceCardsLight,
    marginHorizontal: 4,
  },
  stepLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 24,
  },
  form: { width: '100%', maxWidth: 400 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeBtn: { padding: 6 },
  msgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  msgError: { backgroundColor: Colors.statusError + '15' },
  msgSuccess: { backgroundColor: Colors.statusSuccess + '15' },
  msgText: { ...Typography.caption, flex: 1 },
  button: {
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
  buttonText: { ...Typography.button, color: Colors.textOnAccent },
  backLink: { alignItems: 'center', marginTop: 20, padding: 8 },
  backText: { ...Typography.body, color: Colors.textSecondary },
  backAccent: { color: Colors.brandAccent, fontWeight: '700' },
});
