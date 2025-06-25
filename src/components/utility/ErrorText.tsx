import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import React from "react";

type ErrorTextProps = {
  qm: UseMutationResult<unknown, Error, void, unknown> | UseQueryResult<unknown, Error>;
  override?: string | null;
};

export const ErrorText = ({ qm, override }: ErrorTextProps) => (
    qm.isError || override
      ? (
        <div className="mx-auto w-[80%]">
          <p className="text-center italic font-semibold text-red-500 dark:text-mocha-red text-xs">
            {override || qm.error?.message}
          </p>
        </div>
      )
      : null
  )
;
