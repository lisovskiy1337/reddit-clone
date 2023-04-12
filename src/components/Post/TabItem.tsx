import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react'
import { ITabItem } from './CreatePostForm';

type TabItemProps = {
    item: ITabItem;
    selected: boolean;
    index: number;
    setSelectedTab: (value: number) => void;
  };

const TabItem : React.FC<TabItemProps> = ({item, index, selected, setSelectedTab}) => {
    return (
        <Flex
          justify="center"
          align="center"
          flexGrow={1}
          p="14px 0px"
          cursor="pointer"
          fontWeight={700}
          color={selected ? "blue.500" : "gray.500"}
          borderWidth={"0px 1px 0px 0px"}
          borderBottomColor={selected ? "blue.500" : "gray.200"}
          borderRightColor="gray.200"
          _hover={{ bg: "gray.50" }}
          onClick={() => setSelectedTab(index)}
        >
          <Flex align="center" height="20px" mr={2}>
            <Icon height="100%" as={item.icon} fontSize={18} />
          </Flex>
          <Text fontSize="10pt">{item.title}</Text>
        </Flex>
      );
}

export default TabItem