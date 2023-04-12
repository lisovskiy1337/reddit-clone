import { auth, firestore } from "@/firebase/firebase";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDoc = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) createUserDoc(userCred.user);
  }, [userCred]);

  return (
    <Flex direction="column" width={"100%"} mb={2} gap="2">
      <Button variant="oauth" onClick={() => signInWithGoogle()}>
        <Image
          src="/images/googlelogo.png"
          alt="google"
          width="20px"
          height="20px"
          mr={1}
        />
        Continue with Google
      </Button>
      <Button variant="oauth">Continue with another</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};

export default OAuthButtons;
