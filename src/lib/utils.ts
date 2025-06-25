import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConnectError } from "@connectrpc/connect";
import { instanceToPlain } from "class-transformer";
import { Message, PlainMessage } from "@bufbuild/protobuf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function when(condition: any, str: string) {
  return condition ? str : ""
}

export function statusFrom(error: any) {
  return error.code ? error as ConnectError : ConnectError.from(error);
}

export type ActionRequest<T extends Message<T>> = Omit<PlainMessage<T>, "token">;

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ConnectError };

// action is a higher order function that wraps a next action and turns returned classes and errors into
// plain objects as well as place them into a result object
export async function action<T>(
  asyncFunc: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const result = await asyncFunc();
    return { success: true, data: instanceToPlain(result) as T };
  } catch (error) {
    const status = ConnectError.from(error);
    return { success: false, error: instanceToPlain(status) as ConnectError };
  }
}

// fn is a higher order function that parses the ActionResponse returning the data if success or throwing
// the error if not. This is useful for Tanstack/React-Query queryFn and mutationFn
export function fn<T>(asyncFunction: () => Promise<ActionResponse<T>>) {
  return async () => {
    const response = await asyncFunction();
    if (!response.success) throw response.error;
    return response.data;
  };
}

