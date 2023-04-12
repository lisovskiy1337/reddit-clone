import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const Signup = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formError) setFormError("");
    if (formInput.password !== formInput.repeatPassword) {
      setFormError("Passwords don't match");
      return;
    }
    await createUserWithEmailAndPassword(formInput.email, formInput.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createUserDoc = async (user: User) => {
    await addDoc(
      collection(firestore, "users"),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) createUserDoc(userCred.user);
  }, [userCred]);
  
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
      <Input
        required
        name="repeatPassword"
        placeholder="Repeat Password"
        type="password"
        mb={2}
        value={formInput.repeatPassword}
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
      {formError ||
        (error && (
          <Text textAlign={"center"} fontSize="10pt" color={"red"}>
            {formError ||
              FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
          </Text>
        ))}
      <Button
        type="submit"
        width={"100%"}
        height={"36px"}
        my={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize={"10pt"} justifyContent="center">
        <Text mr={1}>Already have an account? </Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          Log In{" "}
        </Text>
      </Flex>
    </form>
  );
};

export default Signup;
