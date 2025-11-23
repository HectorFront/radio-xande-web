import ImgGoogleIcon from "@/assets/icon_google.png";
import ImgFacebookIcon from "@/assets/icon_facebook.png";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Link,
} from "@heroui/react";
import { Icon } from "../Icon";
import { useEffect, useState } from "react";
import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';

type ModalLoginProps = {
    open?: boolean;
    onClose?: () => void;
};

export const ModalLogin = ({ open, onClose: onCloseProp }: ModalLoginProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loginGoogle, setLoginGoogle] = useState(false);
    const [loginFacebook, setLoginFacebook] = useState(false);
    const [blockedFacebook, setFacebookBlocked] = useState(false);

    useEffect(() => {
        if (open) {
            onOpen();
        }
    }, [open]);

    const onCloseModal = () => {
        onClose();
        onCloseProp();
    };

    return (
        <Modal backdrop="blur" size="xl" isOpen={isOpen} placement="top-center" onOpenChange={onCloseModal}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-5">
                    <h1 className="text-2xl font-bold text-center">Entre na sua conta</h1>                    
                    <div className="w-full flex flex-row items-center justify-center flex-wrap gap-5">
                        <LoginSocialGoogle
                            className="flex-1"
                            onReject={console.log}
                            onResolve={() => {}}
                            client_id={import.meta.env.VITE_CLIENT_ID_GOOGLE}
                            scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
                        >
                            <Button
                                size="lg"
                                className="bg-white text-black font-semibold w-full text-sm"
                            >
                                <img src={ImgGoogleIcon} alt="Google" width={20} />&nbsp;Continuar com o Google
                            </Button>
                        </LoginSocialGoogle>
                        <LoginSocialFacebook
                            className="flex-1"
                            onResolve={() => {}}
                            onReject={console.log}
                            appId={import.meta.env.VITE_CLIENT_ID_META}
                        >
                            <Button
                                size="lg"
                                disabled={blockedFacebook}
                                className="bg-[#1877f2] text-white font-semibold w-full text-sm"
                            >
                                <img src={ImgFacebookIcon} alt="Facebook" width={20} />&nbsp;Continuar com o Facebook
                            </Button>
                        </LoginSocialFacebook>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Input
                        endContent={
                            <Icon name="mail" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                        }
                        label="E-mail"
                        placeholder="Insira seu e-mail"
                        variant="bordered"
                    />
                    <Input
                        endContent={
                            <Icon name="lock" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                        }
                        label="Senha"
                        placeholder="Insira sua senha"
                        type="password"
                        variant="bordered"
                    />
                    <div className="flex px-1 justify-between">
                        <Link color="danger" href="#" size="sm">
                            Esqueceu sua senha?
                        </Link>
                    </div>
                </ModalBody>
                <ModalFooter className="flex flex-col w-full">
                    <Button size="lg" className="w-full font-bold text-xl" color="danger" variant="flat" onPress={onCloseModal}>
                        Entrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}