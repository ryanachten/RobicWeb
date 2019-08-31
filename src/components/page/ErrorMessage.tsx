import * as React from "react";
import { Typography } from "@material-ui/core";

type Props = {
  className?: string;
  error?: Error;
};

export const ErrorMessage = ({ className, error }: Props) => {
  if (!error) {
    return null;
  }
  return (
    <Typography align="center" className={className} color="error">
      {error.message}
    </Typography>
  );
};
