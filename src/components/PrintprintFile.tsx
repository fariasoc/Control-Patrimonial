
import { useNavigation } from '@react-navigation/native';

import { SignOut, Plus, ChatTeardropText} from 'phosphor-react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing'; 


import { dateFormat } from '../utils/firestoreDateFormat';

//import Logo from '../assets/3.svg';

import { Filter } from '../components/Filter';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';

import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { ClockAfternoon, HandWaving, Key } from 'phosphor-react-native';


import { useState } from 'react';



export function PrintFile(){

    

const [equipments, setEquipments] = useState<OrderProps[]>([]);
var equipamentos: string
var stringHTML = createPDF()

function createPDF(){
  let i = 0
  let tableRowInitial = '<tr>'
  let tableDataInitial = '<td style="box-shadow: 0px 0px 9px 0px rgba(0,0,0,0.1);" >'
  let tableRowEnd = '</tr>'
  let tableDataEnd = '</td>'
  let tableDataNull = '<td style="color:white">'

  while ( i < equipments.length){
    equipamentos = 
                   tableRowInitial+ 

                   tableDataInitial +equipments[i].patrimony+tableDataEnd + 
                   tableDataInitial +equipments[i].observation+tableDataEnd + 
                   tableDataInitial +equipments[i].numberSeal+tableDataEnd + 
                   tableDataInitial +equipments[i].stockController+tableDataEnd + 
                   tableDataInitial +equipments[i].operator+tableDataEnd + 
                   tableDataInitial +equipments[i].status +tableDataEnd + 
                   tableDataInitial +equipments[i].when+tableDataEnd + 
                   tableDataNull+equipamentos+tableDataEnd

                   tableRowEnd

                   i++
  }
  return equipamentos
}


// Obtém a data/hora atual
var Data = new Date();

// Guarda cada pedaço em uma variável
var dia     = Data.getDate();           // 1-31
var dia_sem = Data.getDay();            // 0-6 (zero=domingo)
var mes     = Data.getMonth();          // 0-11 (zero=janeiro)
var ano4    = Data.getFullYear();       // 4 dígitos
var hora    = Data.getHours();          // 0-23
var min     = Data.getMinutes();        // 0-59
var seg     = Data.getSeconds();        // 0-59
var mseg    = Data.getMilliseconds();   // 0-999
var tz      = Data.getTimezoneOffset(); // em minutos

// Formata a data e a hora (note o mês + 1)
var str_data = dia + '/' + (mes+1) + '/' + ano4;
var str_hora = hora + ':' + min + ':' + seg;


const html = `
<html>
<head>
<table>
    <tr>
    <td > <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.png/250px-Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.png" style="widht: 100px; height: 100px"  >
    </td>
    
    <td style="font-size: 60px; font-family: Helvetica Neue; font-weight: bold; text-align:left">     
    Control X
    </td>
    </tr>
   
  </tr>
  </table>
 
</head>

<body style="border: solid blue; padding: 10px"  >

  <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;">
    Status da lacração dos equipamentos da LDC
  </h1>

  <p>

    Data do relatório: ${str_data} <br>
    Horário: ${str_hora}

  </p>

  <table>
    <tr style="background-color: #5d7ee1; font-size: 14px; text-transform: uppercase;
    letter-spacing: 0.10em; font-weight: bold">
      <td>Equipamento</td>
      <td>Observação</td>
      <td>Nº do Lacre</td>
      <td>Controle de Estoque</td>
      <td>Operação</td>
      <td>Status</td>
      <td>Data e Hora do Registro</td>
    </tr>
      ${stringHTML}  
  </table>
 
  <footer>
  <table style="margin-left: 30px">
    <tr>
      <td> ________________________ </td>
      <td> ________________________ </td>
      <td> ________________________ </td>
    </tr>
    <tr style="text-align:center">
    <td> Controle de Estoque </td>
    <td> Admnistrativo </td>
    <td> Gerência Industrial </td>
  </tr>
  </table>
  </footer>
</body>
</html>
`;

const print = async () => {
  await Print.printAsync({
    html,
  });
}

const printToFile = async () => {
  const { uri } = await Print.printToFileAsync({
    html
  });
  console.log('O arquivo foi salvo em:', uri);
  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
}




}