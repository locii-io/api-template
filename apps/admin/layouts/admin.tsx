import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AdminSidebar, SidebarRoutesType } from "../components/Sidebar";
import { Container, Menu, MenuItem, Paper, Popover } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { routes } from "components/common/routes";
import { useState } from "react";

export const adminDrawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [dashboardOpen, setDashboardOpen] = useState(true);
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
      open: dashboardOpen,
      handleClick: () => setDashboardOpen(!dashboardOpen),
      routes: [
        {
          title: "Dashboard",
          pathname: routes.dashboard,
        },
        {
          title: "Users",
          pathname: routes.users,
        },
        {
          title: "Courses",
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
          title: "Account",
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
            App
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
