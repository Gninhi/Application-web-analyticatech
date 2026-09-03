"use client";

import { forwardRef } from "react";
import { Button, type ButtonProps, buttonVariants } from "@/components/ui/button";

export type GlassButtonProps = ButtonProps;

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton(props, ref) {
    return <Button ref={ref} {...props} />;
  }
);

export const glassButtonVariants = buttonVariants;
export const glassButtonTextVariants = buttonVariants;
export default GlassButton;
