import { Children } from '~/types';
import { textSizes } from '~/constants';
import React from 'react';

type textProps = {
  children?: Children;
  color?: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
  as?: 'p' | 'strong';
  className?: string;
};

export function Text({ children, color, className, size = 'm', as = 'p' }: textProps) {
  const elements = {
    p: 'p',
    strong: 'strong',
  };

  type TextAttrProps = {
    as: 'p' | 'strong';
    children: Children;
    className?: string;
    style?: React.CSSProperties;
  };

  function TextAttr({ as, children, ...props }: TextAttrProps) {
    return React.createElement(elements[as], props, children);
  }

  return (
    <TextAttr
      as={as}
      className={className}
      style={{
        color: color,
        fontSize: textSizes[size],
      }}
    >
      {children}
    </TextAttr>
  );
}
