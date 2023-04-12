import { authModalState } from "@/atoms/authModalAtom";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { auth } from "@/firebase/firebase";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const Login = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (formError) setFormError("");
    // if (formInput.password !== formInput.repeatPassword) {
    //   setFormError("Passwords don't match");
    //   return;
    // }
    await signInWithEmailAndPassword(formInput.email, formInput.password);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        value={formInput.email}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        mb={2}
        value={formInput.password}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      {error && (
        <Text>
          {FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type="submit"
        width={"100%"}
        height={"36px"}
        my={2}
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex mb={4} fontSize={"9pt"} justifyContent="center">
        <Text mr={1}>Forgot Your Password? </Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
          }
        >
          Reset Password{" "}
        </Text>
      </Flex>
      <Flex fontSize={"10pt"} justifyContent="center">
        <Text mr={1}>New Here? </Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          Sign Up{" "}
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
