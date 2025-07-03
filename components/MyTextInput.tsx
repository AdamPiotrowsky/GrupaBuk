// components/MyTextInput.tsx
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export default function MyTextInput(props: TextInputProps) {
  return <TextInput allowFontScaling={false} {...props} />;
}
