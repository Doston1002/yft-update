import * as React from "react";
export type IconButtonProps = Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "type" | "aria-label"> & {
    label: string;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
};
export declare const IconButton: React.ForwardRefExoticComponent<Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
