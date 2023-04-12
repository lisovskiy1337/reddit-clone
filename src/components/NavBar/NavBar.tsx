import { auth } from "@/firebase/firebase";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Directory from "./Directory/Directory";
import NavBarButtons from "./NavBarButtons";
import SearchInput from "./SearchInput";
import Link from "next/link";

const NavBar: React.FC = () => {
  const [user] = useAuthState(auth);
  return (
    <Flex bg="white" height="48px" padding="6px 12px" position={'sticky'} top={0} zIndex={2}>
      <Flex alignItems="center" flex={{ base: "1 0 auto", sm: "0 1 auto" }}>
        <Link href={"/"}>
          <Image src="/images/redditFace.svg" height="30px" alt="logo" />
        </Link>
        <Link href={"/"}>
          <Image
            src="/images/redditText.svg"
            height="46px"
            alt="reddit"
            display={{ base: "none", md: "flex" }}
          />
        </Link>
      </Flex>
      {user && <Directory />}
      <SearchInput />
      <NavBarButtons />
    </Flex>
  );
};

export default NavBar;
