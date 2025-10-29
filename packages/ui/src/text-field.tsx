"use client";

import * as React from "react";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";

export const TextField = styled(MuiTextField)<MuiTextFieldProps>(
  ({ theme }) => ({
    color: theme.palette.success.main,
    "& .MuiSlider-thumb": {
      "&:hover, &.Mui-focusVisible": {
        boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
      },
      "&.Mui-active": {
        boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
      },
    },
  }),
);
