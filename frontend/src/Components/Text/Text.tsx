import { Children } from "~/types";
import React from "react";

const elements = {
  p: "p",
  b: "b",
}

type textProps = {
  children?: Children;
  fontSize?: string | null;
  color?: string;
  size?: "xs" | "s" | "m" | "l" | "xl" | "2xl";
  noOfLines?: number;
  type?: "p" | "b";
};

type TextAttrProps = {
  type: "p" | "b";
  children: Children;
  [key: string]: any;
};


function TextAttr({ type, children, ...props }: TextAttrProps) {
  return React.createElement(
    elements[type] || elements.p,
    props,
    children
  );
}


export function Text({children, color, size="m", fontSize=null, noOfLines, type="p"}: textProps) {
  const sizes: Record<string, string> = {
    "xs": "0.1rem",
    "s": "0.5rem",
    "m": "1rem",
    "l": "2rem",
    "xl": "3rem",
    "2xl": "4rem"
  }

  return (
    <TextAttr type={type} style={
      {
      color: color,
      fontSize: (fontSize || sizes[size]),
      lineClamp: noOfLines,
    }}
    >
      {children}
    </TextAttr>
  );
}
