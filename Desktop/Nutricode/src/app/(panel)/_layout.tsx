import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';

export default function PanelLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surfaceCardsDark,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.brandAccent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home/page"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="alimentacao/page"
        options={{
          title: 'Alimentação',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="treino/page"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="agua/page"
        options={{
          title: 'Água',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={focused ? 'water' : 'water-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil/page"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrapper : undefined}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      {/* Hide edit screens from tab bar */}
      <Tabs.Screen name="alimentacao/edit" options={{ href: null }} />
      <Tabs.Screen name="treino/edit" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrapper: {
    backgroundColor: Colors.brandAccent + '20',
    borderRadius: 12,
    padding: 6,
    marginBottom: -4,
  },
});
