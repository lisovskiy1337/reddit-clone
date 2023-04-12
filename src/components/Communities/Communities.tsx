import { Flex, MenuItem, Icon, Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CommunityModal from "./CommunityModal";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import MenuListItem from "./MenuListItem";

const Communities = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CommunityModal open={open} handleClose={() => setOpen(false)} />
      {mySnippets.find((item) => item.isModerator) && (
        <Box mt={3} mb={4}>
          <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
            MODERATING
          </Text>
          {mySnippets
            .filter((item) => item.isModerator)
            .map((snippet) => (
              <MenuListItem
                key={snippet.communityId + Math.random()}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
                icon={FaReddit}
                iconColor="brand.100"
              />
            ))}
        </Box>
      )}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId + Math.random()}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imgUrl={snippet.imgUrl}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
