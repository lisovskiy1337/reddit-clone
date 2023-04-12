import { IconType } from "react-icons/lib";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export type DirectoryMenuItem = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imgUrl?: string;
} 

interface DirectoryMenuState  {
    isMenuOpen: boolean,
    selectedMenuItem: DirectoryMenuItem
}

export const defaulDirectoryMenuItem : DirectoryMenuItem = {
    displayText: 'Home',
    link: '/',
    icon: TiHome,
    iconColor: 'black'
}

export const defaultMenuState : DirectoryMenuState  = {
    isMenuOpen: false,
    selectedMenuItem: defaulDirectoryMenuItem 
}

export const directoryMenuState = atom<DirectoryMenuState>({
    key: 'directoryMenuState',
    default: defaultMenuState
})