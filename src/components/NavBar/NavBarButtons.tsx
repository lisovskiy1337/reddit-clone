import { Flex } from "@chakra-ui/react";
import React from "react";
import { AuthButtons } from "./AuthButtons";
import AuthModal from "../Modal/AuthModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import ActionIcons from "./ActionIcons";
import UserMenu from "./UserMenu";

const NavBarButtons = () => {
  const [user] = useAuthState(auth);
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center" gap={2}>
        {user ? <ActionIcons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};

export default NavBarButtons;
