import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  cancelText?: string;
  onConfirm: (date: Date | null) => void;
}

export default function NotificationTimePicker({ visible, title, subtitle, cancelText, onConfirm }: Props) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type !== 'dismissed') {
      setDate(currentDate);
    }
  };

  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  const handleConfirm = () => {
    onConfirm(date);
  };

  const handleCancel = () => {
    onConfirm(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle || 'Deseja configurar um lembrete para sua próxima rotina?'}</Text>

          {Platform.OS === 'android' && (
            <TouchableOpacity style={styles.timeSelector} onPress={handleOpenPicker}>
              <Text style={styles.timeText}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          )}

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              textColor={Colors.textPrimary}
              themeVariant="dark"
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
              <Text style={styles.btnTextCancel}>{cancelText || 'Não, obrigado'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
              <Text style={styles.btnTextConfirm}>Definir Alarme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', backgroundColor: Colors.surfaceCards, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: Colors.surfaceCardsLight },
  title: { ...Typography.h3, color: Colors.brandGreen, textAlign: 'center', marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  timeSelector: { alignSelf: 'center', backgroundColor: Colors.surfaceCardsDark, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: Colors.surfaceCardsLight },
  timeText: { ...Typography.h2, color: Colors.textPrimary },
  actions: { flexDirection: 'row', gap: 12, marginTop: Platform.OS === 'ios' ? 20 : 0 },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.surfaceCardsDark, alignItems: 'center' },
  btnConfirm: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.brandGreen, alignItems: 'center' },
  btnTextCancel: { ...Typography.button, color: Colors.textSecondary },
  btnTextConfirm: { ...Typography.button, color: Colors.backgroundPrimary },
});
