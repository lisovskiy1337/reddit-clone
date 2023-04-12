import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Icon,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import React from "react";
import Communities from "../../Communities/Communities";
import useDirectory from "@/hooks/useDirectory";

const Directory = () => {
  const {directoryState, onToggleMenu} = useDirectory()
  return (
    <Menu isOpen={directoryState.isMenuOpen}>
      <MenuButton
        cursor={"pointer"}
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={onToggleMenu}
      >
        <Flex
          align={"center"}
          justify="space-between"
          width={{ base: "auto", lg: "90px" }}
        >
          <Flex alignItems={"center"}>
          <>
                  {directoryState.selectedMenuItem.imgUrl ? (
                    <Image
                      borderRadius="full"
                      boxSize="24px"
                      src={directoryState.selectedMenuItem.imgUrl}
                      mr={2}
                      alt={directoryState.selectedMenuItem.displayText}
                      objectFit={'cover'}
                    />
                  ) : (
                    <Icon
                      fontSize={24}
                      mr={{ base: 1, md: 2 }}
                      color={directoryState.selectedMenuItem.iconColor}
                      as={directoryState.selectedMenuItem.icon}
                    />
                  )}
                  <Box
                    display={{ base: "none", lg: "flex" }}
                    flexDirection="column"
                    fontSize="10pt"
                  >
                    <Text fontWeight={600}>
                      {directoryState.selectedMenuItem.displayText}
                    </Text>
                  </Box>
                </>
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities/>
      </MenuList>
    </Menu>
  );
};

export default Directory;
