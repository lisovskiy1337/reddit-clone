import { DirectoryMenuItem, directoryMenuState } from "@/atoms/directoryAtom";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const onToggleMenu = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isMenuOpen: !directoryState.isMenuOpen,
    }));
  };
  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router?.push(menuItem.link);
    if (directoryState.isMenuOpen) {
      onToggleMenu();
    }
  };

  return {
    directoryState,
    onToggleMenu,
    onSelectMenuItem,
  };
};

export default useDirectory;
