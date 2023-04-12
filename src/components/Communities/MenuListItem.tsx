import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

type MenuItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imgUrl?: string;
};

const MenuListItem: React.FC<MenuItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imgUrl,
}) => {
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imgUrl })
      }
    >
      <Flex alignItems="center">
        {imgUrl ? (
          <Image
            borderRadius="full"
            boxSize="18px"
            src={imgUrl}
            mr={2}
            alt={displayText}
            objectFit={'cover'}
          />
        ) : (
          <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
