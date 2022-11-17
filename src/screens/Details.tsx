import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView, Box,  Fab, Center } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { Key, Hourglass, LockKeyOpen, User, UserSwitch, Notepad, Tag, Trash, Stack  } from 'phosphor-react-native';

import { dateFormat } from '../utils/firestoreDateFormat';
import { Check  } from 'phosphor-react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  product: string;
  patrimony: string;
  observation: string;
  numberSeal: string;
  operator: string;
  stockController: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [solution, setSolution] = useState('');
  const [stockController, setstockController] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const { orderId } = route.params as RouteParams;

  function handleOrderDelete(){

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .delete()
    .then(() => {
      Alert.alert('Deletado', 'O documento foi excluído.');
      navigation.goBack();
    })

  }

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Por favor', 'Informe o número do lacre atual');
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        stockController,
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { product, patrimony, observation, numberSeal, operator, stockController, status, created_at, closed_at, solution } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          product,
          patrimony,  
          observation,
          numberSeal,
          status,
          operator,
          stockController,
          solution,
          when: dateFormat(created_at),
          closed
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <Key size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'Fechado' : 'Aberto'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false} mb={45}>
        <CardDetails
            title="Produto"
            description={`${order.product}`}
            icon={Stack}
          />
        <CardDetails
          title="equipamento"
          description={`${order.patrimony}`}
          icon={Tag}
        />

        <CardDetails
          title="número do lacre antigo"
          description={order.numberSeal}
          icon={LockKeyOpen}
          footer={`Aberto em ${order.when}`}
        />

        <CardDetails
          title="operador"
          description={order.operator}
          icon={User}

        />

        <CardDetails
          title="Controle de Estoque"
          footer={`Aberto em ${order.when}`}
          description={order.stockController}
          icon={UserSwitch}
        >

        {
            order.status === 'open'
            &&
            <Input
           
              onChangeText={setstockController}
              textAlignVertical="top"

              h={10}
            />
          }


        </CardDetails>

        <CardDetails
          title="número do lacre novo"
          icon={Key}
          description={order.solution}
          footer={order.closed && `Fechado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
           
              onChangeText={setSolution}
              textAlignVertical="top"
              h={10}
            />
          }
        </CardDetails>

        <CardDetails
          title="Observações"
          description={order.observation}
          icon={Notepad}
        />

      </ScrollView>

      <HStack>

        {
          order.status === 'open' &&

          <Fab  
          mr={6}
          bg="green.700" isLoading={isLoading}
          onPress={handleOrderClose}
          icon={<Check  size={25} color="white" weight="bold" />} 
        />

        }

        <Fab
          mr={100}
          bg="gray.700" isLoading={isLoading}
          onPress={handleOrderDelete}
          icon={<Trash   size={25} color="red" weight="bold" />}
        />    
        
      </HStack>


      { /*
          <Button
          title="Confirmar"
          m={5}
          onPress={handleOrderClose}
        />
        */
      }

    </VStack>
  );
}