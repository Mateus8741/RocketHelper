import { useNavigation, useRoute } from "@react-navigation/native";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { FireStoreDTO } from "../DTOs/FireStoreDTO";
import { DateFormat } from "../utils/FireStoreDateFormat";
import { Loading } from "../components/Loading";
import {
  CircleWavyCheck,
  DesktopTower,
  Hourglass,
  Clipboard,
} from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const navigation = useNavigation();

  const { colors } = useTheme();

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleOrderClosed() {
    if (!solution) {
      return Alert.alert("Atenção", "Por favor, informe a solução do problema");
    }
    firestore()
      .collection<FireStoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Sucesso", "Ordem fechada com sucesso");
        navigation.goBack();
      });
  }

  useEffect(() => {
    firestore()
      .collection<FireStoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          solution,
          closed_at,
          created_at,
          status,
        } = doc.data();
        const closed = closed_at ? DateFormat(closed_at) : null;

        setOrder({
          id: orderId,
          patrimony,
          description,
          status,
          solution,
          when: DateFormat(created_at),
          closed,
        });
        setIsLoading(false);
      });
      
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Chamado" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Fechado" : "Aberto"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio: ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="Equipamento"
          description={order.description}
          icon={Clipboard}
          footer={`Aberto em: ${order.when}`}
        />
        <CardDetails
          title="Solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descreva a solução do problema"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button
          m={5}
          title="Encerrar solicitação"
          isLoading={isLoading}
          onPress={handleOrderClosed}
        />
      )}
    </VStack>
  );
}
