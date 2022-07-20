import React, { useEffect, useState } from "react";

import auth from "@react-native-firebase/auth";

import { Alert } from "react-native";

import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { ChatTeardrop, SignOut } from "phosphor-react-native";
import { Order, OrderProps } from "../components/Order";
import { Filter } from "../components/Filter";

import { useNavigation } from "@react-navigation/native";

import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { DateFormat } from "../utils/FireStoreDateFormat";
import { Loading } from "../components/Loading";

export function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  function handleNewOrder() {
    navigation.navigate("Register");
  }
  function handleOpenDetails(orderId: string) {
    navigation.navigate("Details", { orderId });
  }

  function handleSignOut() {
    auth().signOut();
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, created_at, description, status } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: DateFormat(created_at),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={2}
        px={6}
      >
        <Logo />
        <IconButton
          onPress={handleSignOut}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text
            color={
              statusSelected === "open"
                ? colors.secondary[700]
                : colors.green[300]
            }
          >
            {orders.length} chamado{orders.length > 1 ? "s" : ""}{" "}
            {statusSelected === "open" ? "aberto" : "fechado"}
            {orders.length > 1 ? "s" : ""}
          </Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title="Em andamento"
            type="open"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            title="Finalizados"
            type="closed"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardrop size={40} color={colors.gray[300]} />
                <Text color="gray.300" fontSize="xl" textAlign="center">
                  Nenhum chamado{" "}
                  {statusSelected === "open" ? "aberto" : "finalizado"}{" "}
                  encontrado
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Novo chamado" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
