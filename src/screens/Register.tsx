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
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState('');
  const [patrimony, setPatrimony] = useState('');
  const [observation, setObservation] = useState('');
  const [numberSeal, setnumberSeal] = useState('');
  const [operator, setOperator] = useState('');
  const [stockController, setStockController] = useState('');

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (  !product || 
          !patrimony || 
          !numberSeal || 
          !stockController || 
          !operator ) {
      return Alert.alert('Por favor', 'Preencha todos os campos ;)');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        product,
        patrimony,
        observation,
        numberSeal,
        operator,
        stockController,
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
        return Alert.alert('Solicitação', 'Não foi possível registrar a solicitação');
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Equipamento" />

      <Input
        placeholder="Produto"
        mt={4}
        onChangeText={setProduct}
      />

      <Input
        placeholder="Nome do patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />

      <Input
        placeholder="Número do lacre"        
        mt={4}    
        onChangeText={setnumberSeal}
      />

      <Input
        placeholder="Operador"
        mt={4}
        onChangeText={setOperator}
      />

      <Input
        placeholder="Controle de Estoque"
        mt={4}
        onChangeText={setStockController}
      />

      <Input
        placeholder="Observações"   
        textAlignVertical='top' 
        multiline    
        h={100}
        mt={4}    
        onChangeText={setObservation}
      />



      <Fab  
        mr={6}
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
