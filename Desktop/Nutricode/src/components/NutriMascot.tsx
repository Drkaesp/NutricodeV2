import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

export type MascotState = 'alegre' | 'exausto' | 'cozinheiro' | 'confuso';

interface NutriMascotProps {
  state: MascotState;
  style?: StyleProp<ImageStyle>;
  size?: number;
}

export default function NutriMascot({ state, style, size = 150 }: NutriMascotProps) {
  // Define fallback image paths based on requested states.
  // We assume the user has or will add these variants to their assets/images folder.
  // Since 'mascoteLogin.png' exists, let's map 'alegre' and fallback others safely.
  
  let source;
  switch (state) {
    case 'alegre':
      source = require('@/assets/images/mascoteLogin.png');
      break;
    case 'exausto':
      // Fallback or explicit if exists (adjust if needed later)
      source = require('@/assets/images/mascoteLogin.png');
      break;
    case 'cozinheiro':
      source = require('@/assets/images/mascoteLogin.png');
      break;
    case 'confuso':
      source = require('@/assets/images/mascoteLogin.png');
      break;
    default:
      source = require('@/assets/images/mascoteLogin.png');
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={source}
        style={[
          { width: size, height: size, resizeMode: 'contain' },
          style
        ]}
      />
    </View>
  );
}
