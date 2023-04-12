import { atom } from "recoil";

interface IAuthModalProps {
    isOpen: boolean,
    view: 'login' | 'signup' | 'resetPassword'
}

 const defaultModalState : IAuthModalProps = {
    isOpen: false,
    view: 'login'
} 

export const authModalState = atom<IAuthModalProps>({
    key: 'authModalState',
    default: defaultModalState
})