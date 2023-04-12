import {
  Flex,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Text,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { auth } from "@/firebase/firebase";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { IoSparkles } from "react-icons/io5";

interface IProps {
  user?: User | null;
}

const UserMenu: React.FC<IProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <Menu>
      <MenuButton cursor={"pointer"}>
        <Flex align={"center"}>
          <Flex alignItems={"center"}>
            {user ? (
              <Flex alignItems={"center"}>
                <Icon
                  fontSize={24}
                  mr={1}
                  color="gray.300"
                  as={FaRedditSquare}
                />
                <Box
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </Text>
                  <Flex alignItems="center">
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 karma</Text>
                  </Flex>
                </Box>
              </Flex>
            ) : (
              <Icon fontSize={24} mr={1} color="gray.400" as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem>
              <Flex align={"center"}>
                <Icon as={CgProfile} fontSize={18} mr={2} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => signOut(auth)}>
              <Flex align={"center"}>
                <Icon as={MdLogout} fontSize={18} mr={2} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => setAuthModalState({ isOpen: true, view: "login" })}
          >
            <Flex align={"center"}>
              <Icon as={MdLogout} fontSize={18} mr={2} />
              Sign In / Log out
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
