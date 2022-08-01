import { Box, CssBaseline } from "@mui/material";
import { TopNavigation } from "../topNavigation";
import React from "react";

type LayoutProps = {
  children?: JSX.Element;
};

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <CssBaseline />
      <Box>
        <TopNavigation />
        <Box sx={{ px: 30, py: 5 }}>{props.children}</Box>
      </Box>
    </>
  );
};
