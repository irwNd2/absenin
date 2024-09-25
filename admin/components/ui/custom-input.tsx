"use client";

import {
  forwardRef,
  HTMLInputTypeAttribute,
  useState,
  Ref,
  ChangeEvent,
} from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

type InputWithLabelProps = {
  label: string;
  labelFor: string;
  type: HTMLInputTypeAttribute | undefined;
  value: string;
  setValue: (val: string) => void;
  isTextArea?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  valid?: boolean;
  showValidBorder?: boolean;
  showResult?: boolean;
  className?: string;
};

// Use forwardRef to pass the ref to the input or textarea element
const InputWithLabel = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputWithLabelProps
>(
  (
    {
      label,
      labelFor,
      type,
      value,
      setValue,
      isTextArea,
      onFocus,
      showValidBorder,
      valid,
      showResult,
      className,
    },
    ref
  ) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const validBorderClass = () => {
      if (!showValidBorder) return "";
      if (showValidBorder && showResult) {
        if (valid && showResult) return "border-green-600";
        return "border-red-600";
      }
      return "";
    };

    return (
      <div className='relative'>
        <Label
          htmlFor={labelFor}
          className={`absolute bg-white left-3 -top-2 px-1 -ml-1 text-xs transition-all duration-300 ${
            isActive || value?.length > 0
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {label}
        </Label>

        {!isTextArea && (
          <Input
            type={type}
            placeholder={isActive ? "" : label}
            id={labelFor}
            className={cn(
              `rounded-[6px] h-12 py-3 transition-all duration-400 ${
                isActive
                  ? "placeholder:opacity-0 placeholder:translate-y-2"
                  : "placeholder:opacity-100 placeholder:translate-y-0"
              } ${validBorderClass()}`,
              className
            )}
            onFocus={() => {
              setIsActive(true);
              onFocus?.();
            }}
            onBlur={() => setIsActive(false)}
            onChange={(val: ChangeEvent<HTMLInputElement>) =>
              setValue(val?.target?.value)
            }
            value={value}
            ref={ref as Ref<HTMLInputElement>} // Forward the ref to the input
          />
        )}

        {!!isTextArea && (
          <Textarea
            placeholder={isActive ? "" : label}
            className={cn("resize-none rounded-[6px]", className)}
            onFocus={() => {
              setIsActive(true);
              onFocus?.();
            }}
            onBlur={() => setIsActive(false)}
            onChange={(val: ChangeEvent<HTMLTextAreaElement>) =>
              setValue(val?.target?.value)
            }
            value={value}
            id={labelFor}
            ref={ref as Ref<HTMLTextAreaElement>} // Forward the ref to the textarea
          />
        )}
      </div>
    );
  }
);

// Set displayName to help with debugging in dev tools
InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
