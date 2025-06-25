import { Eye, EyeOff } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { Label } from "@radix-ui/react-menu";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { when } from "@/lib/utils";
import { Schema } from "@/lib/schemas/definition";
import Link from "next/link";

type SchemaInputProps = {
  value: string;
  setValue: (value: string) => void;
  name: string;
  schema?: Schema;
  forgotPasswordLink?: boolean;
  forgotUsernameLink?: boolean;
};

export function SchemaInput({
  value,
  setValue,
  name,
  schema,
  forgotPasswordLink,
  forgotUsernameLink
}: SchemaInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [alreadyErrored, setAlreadyErrored] = useState(false);

  const header = name.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  const [showSecureText, setShowSecureText] = useState(name.includes("password"));

  const validateOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const text = e.target.value;
    if (schema && text.length > schema.max) return;
    setValue(text);

    if (!schema) return;
    if (!alreadyErrored) return;
    if (!text) return setError(null);

    const result = schema.safeParse(text);
    setError(result.success ? null : result.error.errors[0].message);
  }

  const validateOnBlur = () => {
    if (!schema) return;
    if (!value) return;

    const result = schema.safeParse(value);
    if (!result.success) setAlreadyErrored(true);
    setError(result.success ? null : result.error.errors[0].message);
  };

  const toggleAsterisks = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowSecureText(!showSecureText)
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label className="font-bold flex justify-between">
        <p>{header}</p>
        {forgotPasswordLink && (
          <Link
            href="/forgot-password"
            className={`italic p-0 m-0 h-min my-auto text-blue-500 font-bold ${buttonVariants({
              variant: "link",
              size: "sm"
            })}`}
          >
            Forgot your password?
          </Link>
        )}
        {forgotUsernameLink && (
          <Link
            href="/forgot-username"
            className={`italic p-0 m-0 h-min my-auto text-blue-500 font-bold ${buttonVariants({
              variant: "link",
              size: "sm"
            })}`}
          >
            Forgot your username?
          </Link>
        )}

      </Label>
      <div className={`${when(name.includes("password"), "flex")}`}>
        <ShadcnInput
          placeholder={`Enter your ${name}...`}
          className={`${when(name.includes("password"), "rounded-r-none border-r-0")} ${when(error, "border-red-500")}`}
          value={value}
          onChange={validateOnChange}
          onBlur={validateOnBlur}
          type={showSecureText ? "password" : "text"}
        />
        {name.includes("password") && (
          <Button variant="outline" size="icon" className="ml-[1px] rounded-l-none" onClick={toggleAsterisks}>
            <Eye className={`h-[1.2rem] w-[1.2rem] transition-all ${when(showSecureText, "hidden")}`} />
            <EyeOff className={`h-[1.2rem] w-[1.2rem] transition-all ${when(!showSecureText, "hidden")}`} />
          </Button>
        )}
      </div>
      {error && <span className="text-red-500 dark:text-mocha-red font-bold text-xs">{error}</span>}
    </div>
  );
}

export type SchemaInputSmProps = {
  value: string;
  setValue: (value: string) => void;
  name: string;
  schema?: Schema;
};

export function SchemaInputSm({ value, setValue, name, schema }: SchemaInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [alreadyErrored, setAlreadyErrored] = useState(false);

  const header = name.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  const [showSecureText, setShowSecureText] = useState(name.includes("password"));

  const validateOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const text = e.target.value;
    if (schema && text.length > schema.max) return;
    setValue(text);

    if (!schema) return;
    if (!alreadyErrored) return;
    if (!text) return setError(null);

    const result = schema.safeParse(text);
    setError(result.success ? null : result.error.errors[0].message);
  }

  const validateOnBlur = () => {
    if (!schema) return;
    if (!value) return;

    const result = schema.safeParse(value);
    if (!result.success) setAlreadyErrored(true);
    setError(result.success ? null : result.error.errors[0].message);
  };

  const toggleAsterisks = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowSecureText(!showSecureText)
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label className="text-left font-bold text-sm">{header}</Label>
      <div className={`${when(name.includes("password"), "flex")}`}>
        <ShadcnInput
          placeholder={`Enter ${name}...`}
          className={`${when(name.includes("password"), "rounded-r-none border-r-0")} ${when(error, "border-red-500")}`}
          value={value}
          onChange={validateOnChange}
          onBlur={validateOnBlur}
          type={showSecureText ? "password" : "text"}
        />
        {name.includes("password") && (
          <Button variant="outline" size="icon" className="ml-[1px] rounded-l-none" onClick={toggleAsterisks}>
            <Eye className={`h-[1.2rem] w-[1.2rem] transition-all ${when(showSecureText, "hidden")}`} />
            <EyeOff className={`h-[1.2rem] w-[1.2rem] transition-all ${when(!showSecureText, "hidden")}`} />
          </Button>
        )}
      </div>
      {error && <span className="text-red-500 dark:text-mocha-red font-bold text-xs">{error}</span>}
    </div>
  );
}
