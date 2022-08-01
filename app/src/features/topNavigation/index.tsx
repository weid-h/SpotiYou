import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

export const TopNavigation = () => {
  return (
    <AppBar position={"static"}>
      <Container>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Typography variant="h6" color="inherit" component="div">
              SpotiYou
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
