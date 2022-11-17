import { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { VStack, HStack, Heading, Icon, useTheme, Text, IconButton } from 'native-base';
import { At, Key, Password, UserCirclePlus } from 'phosphor-react-native';

import Logo from '../assets/3.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const { colors } = useTheme();

  function handleCreateAccount() {
    setIsLoading(true)

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => Alert.alert("Conta", "Cadastrado com sucesso!"))
    .catch((error) => console.error(error))
    .finally(() => setIsLoading(false))
  }

  function handleResetPassword() {

  }

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe e-mail e senha.');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido.');
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.');
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.');
        }

        return Alert.alert('Entrar', 'Não foi possível acessar');
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo height={100} width={100} />

      <Heading color="gray.100" fontSize="xl" mt={10} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={<Icon as={<At color={colors.white} weight="bold" />} ml={5} />}
        onChangeText={setEmail}
      />

      <Input
        mb={5}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.white} weight="bold" />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        color="black"
        title="Cadastrar"
        w="full"
        onPress={handleCreateAccount}
        isLoading={isLoading}
        borderRadius={10}
        bg="pink.700"
        borderWidth={'1'}
        borderColor={colors.gray[700]}

      />

      <HStack justifyContent="space-between" mt={3} alignItems="center" w="full" >

        <IconButton
          icon={<Password size={20} color={colors.white}/>}
          onPress={handleCreateAccount}
        />

        <Text bold color="white" onPress={handleCreateAccount} > Esqueci a senha </Text>

        <IconButton
          icon={<UserCirclePlus size={20} color={colors.white} />}
          onPress={() => navigation.goBack()}
        />

        <Text bold color="white" onPress={handleResetPassword}> Criar minha conta </Text>

      </HStack>

    </VStack>
  )
}