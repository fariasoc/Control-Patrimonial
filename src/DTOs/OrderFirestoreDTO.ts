import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderFirestoreDTO = {
  product: string;
  patrimony: string;
  observation: string;
  numberSeal: string;
  operator: string;
  stockController: string;
  status: 'open' | 'closed',
  solution?: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
  closed_at?: FirebaseFirestoreTypes.Timestamp;
}