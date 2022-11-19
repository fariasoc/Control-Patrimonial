import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center, Fab, Avatar  } from 'native-base';
import { Plus, ChatTeardropText, FileArrowDown, Printer } from 'phosphor-react-native';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { dateFormat } from '../utils/firestoreDateFormat';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';
import PrintPDF from '../components/PrintPDF';

import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
/*
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
          Hello World!
        </h1>
        <img
          src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
          style="width: 90vw;" />
      </body>
    </html>
  `;

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      orientation: Print.Orientation.portrait
      //printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('O arquivo foi salvo em:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf'});
  };

*/

export function Historical() {
  
  const [selectedPrinter, setSelectedPrinter] = React.useState();
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

        <PrintPDF />
        
      <HStack justifyContent="space-between" ml={9} mr={4} >

      <IconButton
          icon={<Printer size={28} color={colors.white} />}
          //onPress={print}
      />

      <IconButton
          icon={<FileArrowDown size={28} color={colors.white} />}
          //onPress={printToFile} 
      />

      <IconButton />

      </HStack>
      
    </VStack>

  );
}