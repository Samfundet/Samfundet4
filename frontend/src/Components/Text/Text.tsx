import { Children } from '~/types';
import { textSizes } from '~/constants';
import React from 'react';

type textProps = {
  children?: Children;
  fontSize?: string | null;
  color?: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
  type?: 'p' | 'strong';
  className?: string;
};

export function Text({ children, color, className, size = 'm', fontSize = null, type = 'p' }: textProps) {
  const elements = {
    p: 'p',
    strong: 'strong',
  };

  type TextAttrProps = {
    type: 'p' | 'strong';
    children: Children;
    className?: string;
    style?: React.CSSProperties;
  };

  function TextAttr({ type, children, ...props }: TextAttrProps) {
    return React.createElement(elements[type] || elements.p, props, children);
  }

  return (
    <TextAttr
      type={type}
      className={className}
      style={{
        color: color,
        fontSize: fontSize || textSizes[size],
      }}
    >
      {children}
    </TextAttr>
  );
}
