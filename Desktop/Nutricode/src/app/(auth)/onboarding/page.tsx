import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import NutriMascot from '@/src/components/NutriMascot';
import { useAuth } from '@/src/context/AuthContext';

type Objetivo = 'perder_peso' | 'ganhar_massa' | 'manter_forma';
type NivelAtividade = 'sedentario' | 'moderado' | 'ativo';

const OBJECTIVES: { key: Objetivo; label: string; icon: string; desc: string }[] = [
  { key: 'perder_peso', label: 'Perder Peso', icon: 'trending-down', desc: 'Queimar gordura e emagrecer' },
  { key: 'ganhar_massa', label: 'Ganhar Massa', icon: 'trending-up', desc: 'Construir músculos e ficar forte' },
  { key: 'manter_forma', label: 'Manter Forma', icon: 'swap-horizontal', desc: 'Manter saúde e equilíbrio' },
];

const ACTIVITY_LEVELS: { key: NivelAtividade; label: string; icon: string; desc: string }[] = [
  { key: 'sedentario', label: 'Sedentário', icon: 'bed', desc: 'Pouco ou nenhum exercício' },
  { key: 'moderado', label: 'Moderado', icon: 'walk', desc: '3-5 dias por semana' },
  { key: 'ativo', label: 'Ativo', icon: 'flash', desc: '6-7 dias por semana' },
];

export default function Onboarding() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [genero, setGenero] = useState<'masculino' | 'feminino' | 'outro' | ''>('');
  const [objetivo, setObjetivo] = useState<Objetivo | ''>('');
  const [nivelAtividade, setNivelAtividade] = useState<NivelAtividade | ''>('');

  const handleNext = () => {
    if (step === 1) {
      if (!peso || !altura || !nascimento || !genero) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!objetivo) return;
      setStep(3);
    }
  };

  const handleConfirm = async () => {
    if (!nivelAtividade) return;
    try {
      await updateUser({
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        nascimento,
        genero: genero as any,
        objetivo: objetivo as any,
        nivelAtividade: nivelAtividade as any,
      });
      router.replace('/(panel)/home/page' as any);
    } catch (e) {
      console.error(e);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepRow}>
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View style={[styles.stepDot, step >= s && styles.stepActive]}>
            {step > s && <Ionicons name="checkmark" size={10} color={Colors.textOnAccent} />}
            {step === s && <Text style={styles.stepNum}>{s}</Text>}
          </View>
          {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Mascot */}
          <NutriMascot state="alegre" size={100} />
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>
              {step === 1 && 'Me conta um pouco sobre você! 🏋️'}
              {step === 2 && 'Qual é o seu objetivo? 🎯'}
              {step === 3 && 'Qual seu nível de atividade? ⚡'}
            </Text>
          </View>

          {renderStepIndicator()}

          {/* Step 1: Body Info */}
          {step === 1 && (
            <View style={styles.formSection}>
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="scale-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Peso (kg)" placeholderTextColor={Colors.textMuted} value={peso} onChangeText={setPeso} keyboardType="numeric" maxLength={3} />
                </View>
                <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                  <Ionicons name="resize-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Altura (cm)" placeholderTextColor={Colors.textMuted} value={altura} onChangeText={setAltura} keyboardType="numeric" />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Nascimento (DD/MM/AAAA)" 
                  placeholderTextColor={Colors.textMuted} 
                  value={nascimento} 
                  onChangeText={(t) => {
                    let val = t.replace(/\D/g, '');
                    if(val.length > 2) val = val.substring(0,2) + '/' + val.substring(2);
                    if(val.length > 5) val = val.substring(0,5) + '/' + val.substring(5, 9);
                    setNascimento(val);
                  }} 
                  keyboardType="numeric" 
                  maxLength={10} 
                />
              </View>

              <Text style={styles.sectionLabel}>Gênero</Text>
              <View style={styles.optionRow}>
                {[
                  { key: 'masculino', label: 'Masculino', icon: 'male' },
                  { key: 'feminino', label: 'Feminino', icon: 'female' },
                  { key: 'outro', label: 'Outro', icon: 'person' },
                ].map((g) => (
                  <TouchableOpacity
                    key={g.key}
                    style={[styles.optionPill, genero === g.key && styles.optionPillActive]}
                    onPress={() => setGenero(g.key as any)}>
                    <Ionicons name={g.icon as any} size={18} color={genero === g.key ? Colors.textOnAccent : Colors.textSecondary} />
                    <Text style={[styles.optionText, genero === g.key && styles.optionTextActive]}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Objective */}
          {step === 2 && (
            <View style={styles.formSection}>
              {OBJECTIVES.map((obj) => (
                <TouchableOpacity
                  key={obj.key}
                  style={[styles.bigCard, objetivo === obj.key && styles.bigCardActive]}
                  onPress={() => setObjetivo(obj.key)}>
                  <View style={[styles.bigCardIcon, objetivo === obj.key && styles.bigCardIconActive]}>
                    <Ionicons name={obj.icon as any} size={28} color={objetivo === obj.key ? Colors.textOnAccent : Colors.brandAccent} />
                  </View>
                  <View style={styles.bigCardInfo}>
                    <Text style={[styles.bigCardTitle, objetivo === obj.key && styles.bigCardTitleActive]}>{obj.label}</Text>
                    <Text style={styles.bigCardDesc}>{obj.desc}</Text>
                  </View>
                  {objetivo === obj.key && <Ionicons name="checkmark-circle" size={24} color={Colors.brandAccent} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <View style={styles.formSection}>
              {ACTIVITY_LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl.key}
                  style={[styles.bigCard, nivelAtividade === lvl.key && styles.bigCardActive]}
                  onPress={() => setNivelAtividade(lvl.key)}>
                  <View style={[styles.bigCardIcon, nivelAtividade === lvl.key && styles.bigCardIconActive]}>
                    <Ionicons name={lvl.icon as any} size={28} color={nivelAtividade === lvl.key ? Colors.textOnAccent : Colors.brandAccent} />
                  </View>
                  <View style={styles.bigCardInfo}>
                    <Text style={[styles.bigCardTitle, nivelAtividade === lvl.key && styles.bigCardTitleActive]}>{lvl.label}</Text>
                    <Text style={styles.bigCardDesc}>{lvl.desc}</Text>
                  </View>
                  {nivelAtividade === lvl.key && <Ionicons name="checkmark-circle" size={24} color={Colors.brandAccent} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navRow}>
            {step > 1 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
                <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
                <Text style={styles.backBtnText}>Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, step === 1 && { flex: 1 }]}
              onPress={step === 3 ? handleConfirm : handleNext}
              activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>{step === 3 ? 'Começar! 🚀' : 'Próximo'}</Text>
              {step < 3 && <Ionicons name="arrow-forward" size={20} color={Colors.textOnAccent} />}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  chatBubble: {
    backgroundColor: Colors.surfaceCards,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.brandAccent + '40',
    marginTop: 10,
    marginBottom: 16,
    maxWidth: 300,
  },
  chatText: { ...Typography.body, color: Colors.textPrimary, textAlign: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceCardsLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: { backgroundColor: Colors.brandAccent },
  stepNum: { ...Typography.captionBold, color: Colors.textOnAccent },
  stepLine: { width: 50, height: 2, backgroundColor: Colors.surfaceCardsLight, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.brandAccent },
  formSection: { width: '100%', maxWidth: 400 },
  inputRow: { flexDirection: 'row' },
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
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: Colors.textPrimary, paddingVertical: 14, fontSize: 16 },
  sectionLabel: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: 8, marginTop: 4 },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
  },
  optionPillActive: { backgroundColor: Colors.brandAccent, borderColor: Colors.brandAccent },
  optionText: { ...Typography.captionBold, color: Colors.textSecondary },
  optionTextActive: { color: Colors.textOnAccent },
  bigCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.surfaceCardsLight,
  },
  bigCardActive: { borderColor: Colors.brandAccent, backgroundColor: Colors.brandAccent + '10' },
  bigCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.brandAccent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bigCardIconActive: { backgroundColor: Colors.brandAccent },
  bigCardInfo: { flex: 1 },
  bigCardTitle: { ...Typography.h3, color: Colors.textPrimary },
  bigCardTitleActive: { color: Colors.brandAccent },
  bigCardDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  navRow: { flexDirection: 'row', width: '100%', maxWidth: 400, gap: 12, marginTop: 24, paddingBottom: 20 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.surfaceCards,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  backBtnText: { ...Typography.button, color: Colors.textPrimary },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.brandAccent,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.brandAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: { ...Typography.button, color: Colors.textOnAccent },
});
