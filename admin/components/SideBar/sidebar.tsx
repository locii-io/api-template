import * as React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Drawer, styled, Toolbar } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton, {
  ListItemButtonProps,
} from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { adminDrawerWidth } from '../../layouts/admin';

export const routes = {
  dashboard: '/dashboard',
  users: '/models/users',
  courses: '/models/courses',
  accountSettings: '/settings/account',
};

interface Props {
  mobileDrawerOpen: boolean;
  handleMobileDrawerToggle: () => void;
}

const MainListItem = styled(ListItemButton)<ListItemButtonProps>(
  ({ theme }) => ({
    paddingLeft: theme.spacing(3),
  }),
);

const DropDownListItem = styled(ListItemButton)<ListItemButtonProps>(
  ({ theme }) => ({
    paddingLeft: theme.spacing(3),
    '& .MuiListItemText-primary': {
      fontWeight: 500,
    },
  }),
);

const NestedListItem = ({
  title,
  pathname,
}: {
  title: string;
  pathname: string;
}) => {
  const router = useRouter();
  return (
    <ListItemButton
      sx={{ pl: 5 }}
      selected={router.pathname === pathname}
      onClick={() => router.push(pathname)}
    >
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export const AdminSidebar = ({
  mobileDrawerOpen,
  handleMobileDrawerToggle,
}: Props) => {
  const router = useRouter();
  const [modelsOpen, setModelsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <MainListItem
          selected={router.pathname === routes.dashboard}
          onClick={() => router.push(routes.dashboard)}
        >
          <ListItemText primary="Dashboard" />
        </MainListItem>
        <DropDownListItem onClick={() => setModelsOpen(!modelsOpen)}>
          <ListItemText primary="Models" />
          {modelsOpen ? <ExpandLess /> : <ExpandMore />}
        </DropDownListItem>
        <Collapse in={modelsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NestedListItem title="Users" pathname={routes.users} />
            <NestedListItem title="Courses" pathname={routes.courses} />
          </List>
        </Collapse>
        <DropDownListItem onClick={() => setSettingsOpen(!settingsOpen)}>
          <ListItemText primary="Settings" />
          {settingsOpen ? <ExpandLess /> : <ExpandMore />}
        </DropDownListItem>
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NestedListItem title="Account" pathname={routes.accountSettings} />
          </List>
        </Collapse>
      </List>
    </div>
  );
  return (
    <Box
      component="nav"
      sx={{ width: { md: adminDrawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: adminDrawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: adminDrawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
