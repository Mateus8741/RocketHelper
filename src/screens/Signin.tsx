import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

import { VStack, Heading, Icon, useTheme } from "native-base";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";

export function SignIn() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      Alert.alert("Error", "Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(true);
        navigation.navigate("Home");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.code === "auth/user-not-found") {
          Alert.alert("Error", "Usuário não encontrado");
        }
        if (error.code === "auth/invalid-email") {
          Alert.alert("Error", "Email ou Senha inválidos");
        }
        if (error.code === "auth/wrong-password") {
          Alert.alert("Error", "Email ou Senha inválidos");
        }
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo width={200} height={200} />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
