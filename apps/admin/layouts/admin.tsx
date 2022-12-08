import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AdminSidebar, SidebarRoutesType } from "ui/components/Sidebar";
import { Container, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";

export const adminDrawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export const routes = {
  dashboard: "/dashboard",
  users: "/models/users",
  courses: "/models/courses",
  accountSettings: "/settings/account",
};


export default function AdminLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [modelsOpen, setModelsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const sidebarRoutes: SidebarRoutesType = [
    {
      name: "Dashboard",
      pathname: routes.dashboard,
    },
    {
      name: "Models",
      open: modelsOpen,
      handleClick: () => setModelsOpen(!modelsOpen),
      routes: [
        {
          name: "Users",
          pathname: routes.users,
        },
        {
          name: "Courses",
          pathname: routes.courses,
        },
      ],
    },
    {
      name: "Settings",
      open: settingsOpen,
      handleClick: () => setSettingsOpen(!settingsOpen),
      routes: [
        {
          name: "Account",
          pathname: routes.accountSettings,
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1300,
        }}
        variant="outlined"
        color="inherit"
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin App
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              keepMounted
              open={Boolean(profileAnchor)}
              anchorEl={profileAnchor}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>My account</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <AdminSidebar
        sidebarRoutes={sidebarRoutes}
        mobileDrawerOpen={mobileOpen}
        handleMobileDrawerToggle={handleDrawerToggle}
        adminDrawerWidth={adminDrawerWidth}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 5, width: { sm: `calc(100% - ${adminDrawerWidth}px)` } }}
      >
        <Toolbar />
        <Container>{children}</Container>
      </Box>
    </Box>
  );
}
