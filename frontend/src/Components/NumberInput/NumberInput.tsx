import React, { useEffect, useState } from 'react';
import { Input, type InputProps } from '~/Components';

type ControlledInputProps = Extract<InputProps, { value: string | number | readonly string[] }>;

export interface NumberInputProps extends Omit<ControlledInputProps, 'onChange'> {
  onChange?: (...event: unknown[]) => void;
  allowDecimal?: boolean;
  clamp?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, value, type, min, max, allowDecimal = true, clamp = true, onBlur, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    const canClamp = clamp && (min !== undefined || max !== undefined);

    function clampValue(n: number) {
      if (!canClamp) {
        return n;
      }
      let clamped = n;
      if (min !== undefined) {
        clamped = Math.max(clamped, Number(min));
      }
      if (max !== undefined) {
        clamped = Math.min(clamped, Number(max));
      }
      return clamped;
    }

    function handleOnBlur(event: React.FocusEvent<HTMLInputElement>) {
      if (canClamp) {
        const clamped = clampValue(Number(event.target.value) || 0);
        if (!Number.isNaN(clamped)) {
          setInputValue(clamped);
          onChange?.(clamped);
        }
      }
      onBlur?.(event);
    }

    function isValidPartial(s: string) {
      // Allows for partial inputs like "-" or "1."
      const re = allowDecimal ? /^-?[0-9]*\.?[0-9]*$/ : /^-?[0-9]*$/;
      return re.test(s);
    }

    function previewAfterInsert(input: HTMLInputElement, data: string) {
      const val = input.value;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      return val.slice(0, start) + data + val.slice(end);
    }

    function previewAfterDelete(input: HTMLInputElement, isBackspace: boolean) {
      const val = input.value;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      if (start !== end) {
        // Range selected, delete selection
        return val.slice(0, start) + val.slice(end);
      }

      if (isBackspace) {
        // No selection, single char deletion
        return val.slice(0, start - 1) + val.slice(start);
      }
      return val.slice(0, start) + val.slice(start + 1);
    }

    function onBeforeInput(e: React.FormEvent<HTMLInputElement>) {
      const event = e as React.CompositionEvent<HTMLInputElement>;
      if (!event.data) {
        return;
      }
      const preview = previewAfterInsert(event.currentTarget, event.data);
      if (!isValidPartial(preview)) {
        e.preventDefault();
        return;
      }
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const preview = previewAfterDelete(event.currentTarget, event.key === 'Backspace');
        if (!isValidPartial(preview)) {
          event.preventDefault();
          return;
        }
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const add = event.key === 'ArrowUp' ? 1 : -1;
        const multiplier = event.shiftKey ? 10 : 1;

        const newVal = clampValue((Number(inputValue) || 0) + add * multiplier);
        if (!Number.isNaN(newVal)) {
          setInputValue(newVal);
          onChange?.(newVal);
        }
      }
    }

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
      const val = event.target.value;
      if (isValidPartial(val)) {
        setInputValue(val);
      }
      // This ensures we don't send partially valid inputs
      const num = Number(val);
      if (!Number.isNaN(num)) {
        onChange?.(num);
      }
    }

    return (
      <Input
        type="text"
        inputMode="numeric"
        pattern={allowDecimal ? '-?[0-9]*.?[0-9]+' : '-?[0-9]+'}
        ref={ref}
        value={inputValue}
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        {...props}
      />
    );
  },
);
NumberInput.displayName = 'NumberInput';
