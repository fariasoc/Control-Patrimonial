import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Fab, VStack } from 'native-base';
import { Check  } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';


export function Register() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');



  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Registrar', 'Preencha todos os campos.');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert('Solicitação', 'Não foi possível registrar o pedido');
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Equipamento" />

      <Input
        placeholder="Nome do patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />

      <Input
        placeholder="Número do lacre"
        flex={1}
        mt={4}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Fab  
        bg="green.700" isLoading={isLoading}
        onPress={handleNewOrderRegister}
        icon={<Check  size={30} color="white" weight="bold" />} 
      />

{/* 
      <Button
        title="OK"
        mt={5}
        bg="green.700"
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
        icon={<CirclesThreePlus size={20} color="white" />}
      />
*/}      

    </VStack>
  );
}
