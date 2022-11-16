import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Fab, Avatar  } from 'native-base';
import { SignOut, Plus, ChatTeardropText, Circle} from 'phosphor-react-native';


import { dateFormat } from '../utils/firestoreDateFormat';

//import Logo from '../assets/3.svg';

import { Filter } from '../components/Filter';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();
  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error);
        return Alert.alert('Sair', 'Não foi possível sair.');
      });
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const {   patrimony, observation, numberSeal, operator, stockController, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            observation,
            numberSeal,
            operator, 
            stockController,
            status,
            when: dateFormat(created_at)
          }
        });

        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={3} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={8}
        pb={1}
        px={6}
      >

        <Heading color="white">Controle Patrimonial </Heading>

        <IconButton
          icon={<SignOut size={20} color={colors.white} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={4} mb={4} justifyContent="space-between" alignItems="center">
          <Heading size="md" color="gray.100" >
            Equipamentos
          </Heading>      

          <Avatar h={8} w={8} mr={2} borderWidth={'1'} bg="gray.400">

            <Text bold  color="white" fontSize="md"  >
              {orders.length}
            </Text>

          </Avatar>
        </HStack>

        <HStack space={3} mb={6}>
          <Filter
            type="open"
            title="Aberto"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter
            type="closed"
            title="Fechado"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
          <Filter
            title="Histórico"
          />
        </HStack>
        {
          isLoading ? <Loading /> :
            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText color={colors.gray[300]} size={40} />
                  <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                    Nada {'\n'}
                    {statusSelected === 'open' ? 'por enquanto' : 'por enquanto'}
                  </Text>
                </Center>
              )}
            />
        }

        <Fab  
            onPress={handleNewOrder}       
            borderWidth={'1'}
            bg={colors.pink[700]}
            mr={7}
            _pressed={{ bg: "gray.700" }}
            icon={<Plus  size={14} color={colors.white} weight="bold"  />}
    />

     {/*  <Button title="+" onPress={handleNewOrder} />  */}

        
      </VStack>

      
    </VStack>
  );
}