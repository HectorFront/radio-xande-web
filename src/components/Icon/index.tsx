import { clsx } from "clsx";
import { HTMLAttributes, useLayoutEffect, useRef, useState } from "react";

interface IconRootProps extends HTMLAttributes<HTMLElement> {
    name: string;
    spin?: boolean;
    staticMarkup?: boolean;
    filled?: boolean;
    pulse?: boolean;
    className?: string;
    [index: string]: any;
}

export const Icon = ({ name, spin = false, pulse = false, filled = false, staticMarkup = false, className = '', ...restProps }: IconRootProps) => {
    let intervalBlob;
    const refIcon: { current: HTMLElement | null } = useRef(null);
    const [blobPulse, setBlobPulse] = useState(false);

    function checkFontLoaded() {
        document.fonts.load("24px Material Symbols Outlined").then(() => {
            if (refIcon.current) {
                refIcon.current.innerText = name;
            }
        });
    }

    useLayoutEffect(() => {
        checkFontLoaded();
        if (pulse) {
            intervalBlob = setInterval(() => setBlobPulse(value => !value), 5e2);
        }
        return () => {
            if(intervalBlob) clearInterval(intervalBlob);
        }
    }, [name]);

    return (
        <i
            ref={refIcon}
            className={clsx('text-2xl', className, 'material-symbols-outlined', { "filled-icon": filled || blobPulse }, { "animate-spin": spin })}
            {...restProps}
        >
            {staticMarkup ? name : null}
        </i>
    );
}