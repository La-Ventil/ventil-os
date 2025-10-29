"use client";

import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const Button = styled(MuiButton)<MuiButtonProps>(({ theme }) => ({
  color: theme.palette.success.main,
}));
