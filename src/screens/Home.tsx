import React, { useState } from "react";
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

export function Home() {
  const navigation = useNavigation();

  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: "123",
      patrimony: "123456",
      when: "2020-01-01 at 12:00",
      status: "open",
    },
  ]);
  const { colors } = useTheme();

  function handleNewOrder() {
    navigation.navigate("Register");
  }
  function handleOpenDetails(orderId: string) {
    navigation.navigate("Details", { orderId });
  }
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
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
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
          <Text color="gray.200">3</Text>
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
                {statusSelected === "open" ? "aberto" : "finalizado"} encontrado
              </Text>
            </Center>
          )}
        />
        <Button title="Novo chamado" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
