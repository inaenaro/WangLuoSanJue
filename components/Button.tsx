import { tv } from "tailwind-variants";

const colors = {
  primary: "bg-[#5865f2] hover:bg-[#4752c4] disabled:bg-[#474f98]",
  secondary: "bg-[#4e5058] hover:bg-[#6d6f78] disabled:bg-[#42454c]",
  success: "bg-[#248046] hover:bg-[#1a6334] disabled:bg-[#2d5d42]",
  danger: "bg-[#da373c] hover:bg-[#a12828] disabled:bg-[#88383e]"
}

type ButtonStyle = keyof typeof colors;

export const button = tv({
  base: "p-2 rounded-md text-white disabled:cursor-not-allowed",
  variants: {
    style: colors as { [key in ButtonStyle]: string }
  },
  defaultVariants: {
    style: "primary"
  }
});