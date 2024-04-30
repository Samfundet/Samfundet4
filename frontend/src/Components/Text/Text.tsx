import { Children } from '~/types';
import { textSizes } from '~/constants';
import React from 'react';

type textProps = {
  children?: Children;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
  as?: 'p' | 'strong' | 'u' | 'i' | 'em' | 'mark' | 'del' | 'ins';
  className?: string;
};

export function Text({ children, className, size = 'm', as = 'p' }: textProps) {
  const elements = {
    p: 'p',
    strong: 'strong',
    u: 'u',
    i: 'i',
    em: 'em',
    mark: 'mark',
    del: 'del',
    ins: 'ins',
  };

  type TextAttrProps = {
    as: 'p' | 'strong' | 'u' | 'i' | 'em' | 'mark' | 'del' | 'ins';
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
        fontSize: textSizes[size],
        display: 'block',
        width: "fit-content"
      }}
    >
      {children}
    </TextAttr>
  );
}
