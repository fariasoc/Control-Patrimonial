import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Fab, Avatar  } from 'native-base';
import { SignOut, Plus, ChatTeardropText, FileArrowDown, Printer } from 'phosphor-react-native';

import { dateFormat } from '../utils/firestoreDateFormat';

//import Logo from '../assets/3.svg';

import { Filter } from '../components/Filter';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';

export function Historical() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();
  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenHistoric() {
    navigation.navigate('historical');
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
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { product, patrimony, observation, numberSeal, operator, stockController, status, created_at } = doc.data();

          return {
            id: doc.id,
            product,
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
  }, []);

  return (
    <VStack flex={1} pb={3} bg="gray.700">
      
          <Header title="Histórico" />



      <VStack flex={1} px={6}>
        <HStack w="full" mt={4} mb={4} justifyContent="space-between" alignItems="center">
          <Heading size="md" color="gray.100" >
            Todos os Equipamentos
          </Heading>      

          <Avatar h={8} w={8} mr={2} borderWidth={'1'} bg="gray.400">

            <Text bold  color="white" fontSize="md"  >
              {orders.length}
            </Text>

          </Avatar>
        </HStack>

        <HStack space={3} mb={1}>
          
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

      <HStack justifyContent="space-between" ml={9} mr={4} >

      <IconButton
          icon={<Printer size={28} color={colors.white} />}
          
        />

      <IconButton
          icon={<FileArrowDown size={28} color={colors.white} />}
          
        />

      <IconButton
          
          
        />


      </HStack>


      
    </VStack>

  );
}