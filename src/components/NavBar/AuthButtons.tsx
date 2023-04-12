import { authModalState } from "@/atoms/authModalAtom";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

export const AuthButtons = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="32px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        onClick={() => setAuthModalState({ isOpen: true, view: "login" })}
      >
        Sign In
      </Button>
      <Button
        variant="solid"
        height="32px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        onClick={() => setAuthModalState({ isOpen: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};
