import React from 'react';
import { Input as NativeBaseIput, IInputProps } from 'native-base';

export function Input({...rest}: IInputProps ) {
  return (
    <NativeBaseIput
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="white"
      _focus={{
        borderWidth:1,
        borderColor: "blue.700",
        bg: "gray.700",
      }}
      {...rest}
    />
  );
} 