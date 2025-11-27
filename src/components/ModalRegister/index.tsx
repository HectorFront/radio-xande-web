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
    Input
} from "@heroui/react";
import { Icon } from "../Icon";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
import { ExecutorRequest } from "@/http/executor";
import { RequestOAuthRegister } from "@/http/requests/user";
import { ContextAuthentication } from "@/contexts/Authentication";
import { Alert } from "../Notification";

type ModalLoginProps = {
    open?: boolean;
    onClose?: () => void;
};

export const ModalRegister = ({ open, onClose: onCloseProp }: ModalLoginProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { setAuthentication } = useContext(ContextAuthentication)
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [blockedFacebook, setFacebookBlocked] = useState(false);
    const [openOAuthBigTech, setOpenOAuthBigTech] = useState(false);

    useEffect(() => {
        if (open) {
            onOpen();
        }
    }, [open]);

    const onCloseModal = () => {
        onClose();
        onCloseProp();
    };

    const handleErrorOAuthBigTech = () => {
        setLoadingRegister(false);
        setOpenOAuthBigTech(false);
    };

    const handleGoogleResponse = useCallback((response) => {
        // access_token
        setOpenOAuthBigTech(false);
        const { data } = response;
        ExecutorRequest(new RequestOAuthRegister({ access_token: data.access_token }, "google"))
            .then(response => setAuthentication(response))
            .catch(_err => Alert.error("Algo deu errado", "Vamos analisar o problema em breve"));
    }, []);

    const handleFacebookResponse = useCallback((response) => {
        // accessToken
        setOpenOAuthBigTech(false);
        const { data } = response;
        ExecutorRequest(new RequestOAuthRegister({ access_token: data.accessToken }, "facebook"))
            .then(response => setAuthentication(response))
            .catch(_err => Alert.error("Algo deu errado", "Vamos analisar o problema em breve"));
    }, []);

    return (
        <Modal backdrop="blur" size="3xl" isOpen={isOpen} placement="center" onOpenChange={onCloseModal}>
            <ModalContent className="py-5">
                <ModalHeader className="flex flex-col gap-5">
                    <h1 className="text-2xl font-bold text-center">Crie uma conta segura com a Mexpenses</h1>                    
                    <div className="w-full flex flex-row items-center justify-center flex-wrap gap-5">
                        <LoginSocialGoogle
                            className="flex-1"
                            onReject={handleErrorOAuthBigTech}
                            onResolve={handleGoogleResponse}
                            onLoginStart={() => setOpenOAuthBigTech(true)}
                            client_id={import.meta.env.VITE_CLIENT_ID_GOOGLE}
                            scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
                        >
                            <Button
                                size="lg"
                                onPress={e => e.preventDefault()}
                                className="bg-white text-black font-semibold w-full text-sm"
                            >
                                <img src={ImgGoogleIcon} alt="Google" width={20} />&nbsp;Continuar com o Google
                            </Button>
                        </LoginSocialGoogle>
                        <LoginSocialFacebook
                            className="flex-1"
                            onReject={handleErrorOAuthBigTech}
                            onResolve={handleFacebookResponse}
                            appId={import.meta.env.VITE_CLIENT_ID_META}
                            onLoginStart={() => setOpenOAuthBigTech(true)}
                        >
                            <Button
                                size="lg"
                                disabled={blockedFacebook}
                                onPress={e => e.preventDefault()}
                                className="bg-[#1877f2] text-white font-semibold w-full text-sm"
                            >
                                <img src={ImgFacebookIcon} alt="Facebook" width={20} />&nbsp;Continuar com o Facebook
                            </Button>
                        </LoginSocialFacebook>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <Input
                            endContent={
                                <Icon name="account_circle" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                            }
                            label="Codinome"
                            placeholder="Insira um codinome ou apelido"
                            variant="bordered"
                        />
                        <Input
                            endContent={
                                <Icon name="mail" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                            }
                            label="E-mail"
                            placeholder="Insira seu e-mail"
                            variant="bordered"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <Input
                            endContent={
                                <Icon name="lock" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                            }
                            label="Senha"
                            placeholder="Insira sua senha"
                            type="password"
                            variant="bordered"
                        />
                        <Input
                            endContent={
                                <Icon name="lock" className="text-2xl text-default-400 pointer-events-none shrink-0" />
                            }
                            label="Confirmar senha"
                            placeholder="Confirme sua senha"
                            type="password"
                            variant="bordered"
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="flex flex-col w-full">
                    <Button size="lg" className="w-full font-bold text-xl" color="danger" variant="flat" onPress={onCloseModal}>
                        Criar conta
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}