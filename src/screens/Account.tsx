import { useState } from 'react';
import { Alert } from 'react-native';
import React from "react";
import auth from '@react-native-firebase/auth';
import { Popover, Button, Input, FormControl, Box, Center, NativeBaseProvider, IconButton } from "native-base";
import { UserCirclePlus } from "phosphor-react-native";

export function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleCreateAccount() {
    setIsLoading(true)
    if ( !email || !password ) {
      return Alert.alert('Por favor', 'Preencha todos os campos ;)');
    }

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => Alert.alert("Conta", "Cadastrado com sucesso!"))
    .catch((error) => console.error(error))
    .finally(() => setIsLoading(false))
  }

  function handleForgotPassword() {
    setIsLoading(true)
    if ( !email ) {
      return Alert.alert('Por favor', 'Mencione o e-mail');
    }
    auth()
    .sendPasswordResetEmail(email)
    .then(() => Alert.alert("Redefinição de senha", "Enviamos um e-mail para você"))
    .catch(error=> console.log(error))
  }

  const initialFocusRef = React.useRef(null);
  return <Box w="100%" alignItems="center">
      <Popover initialFocusRef={initialFocusRef} trigger={triggerProps => {
      return  <IconButton 
                {...triggerProps}
                icon={<UserCirclePlus size={32} color="white" />}  
              />    
    }}>
        <Popover.Content width="56" >
          <Popover.Arrow />
          <Popover.CloseButton />
          {
          /* @ts-ignore */
        }
          <Popover.Header bg="dark.100" color="white" _text={{
            color: "white"
          }}>Criar uma conta</Popover.Header>
          <Popover.Body bg="dark.100">
            <FormControl bg="dark.100">
              <FormControl.Label _text={{
              fontSize: "xs",
              fontWeight: "bold",
              color: "white"              
            }}>
                E-mail
              </FormControl.Label>
              <Input rounded="sm" fontSize="xs" ref={initialFocusRef} onChangeText={setEmail} color="white"  />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label _text={{
              fontSize: "xs",
              fontWeight: "bold",
              color: "white"
            }}>
                Senha
              </FormControl.Label>
              <Input rounded="sm" fontSize="xs" onChangeText={setPassword} color="white"/>
            </FormControl>
          </Popover.Body>
          <Popover.Footer bg="dark.100" justifyContent="center">
            <Button.Group >
              <Button onPress={handleForgotPassword} variant="ghost">Refefinir senha</Button>
              <Button colorScheme="pink" onPress={handleCreateAccount}>Cadastrar</Button>
            </Button.Group>
          </Popover.Footer>
        </Popover.Content>
      </Popover>
    </Box>;
}

    export default () => {
        return (
          <NativeBaseProvider>
            <Center  px="3">
                <Account />
            </Center>
          </NativeBaseProvider>
        );
    };
    