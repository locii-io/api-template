import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Drawer, styled, Toolbar } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

export type SidebarRoutesType = {
  name: string;
  open?: boolean;
  handleClick?: () => void;
  pathname?: string;
  routes?: {
    name: string;
    pathname: string;
  }[];
}[];

interface Props {
  mobileDrawerOpen: boolean;
  adminDrawerWidth: number;
  handleMobileDrawerToggle: () => void;
  sidebarRoutes: SidebarRoutesType;
}

const MainListItemBtn = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  '& .MuiListItemText-primary': {
    fontWeight: 500,
  },
}));

export const AdminSidebar = ({
  mobileDrawerOpen,
  handleMobileDrawerToggle,
  sidebarRoutes,
  adminDrawerWidth,
}: Props) => {
  const router = useRouter();
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {sidebarRoutes.map(({ open, handleClick, routes, name, pathname }, index) =>
          routes ? (
            <Fragment key={index}>
              <MainListItemBtn onClick={handleClick}>
                <ListItemText primary={name} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </MainListItemBtn>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {routes.map((route, index) => (
                    <ListItemButton
                      key={index}
                      sx={{ pl: 5 }}
                      selected={router.pathname === route.pathname}
                      onClick={() => router.push(route.pathname)}
                    >
                      <ListItemText primary={route.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Fragment>
          ) : (
            <Fragment key={index}>
              <MainListItemBtn
                onClick={() => pathname && router.push(pathname)}
                selected={router.pathname === pathname}
              >
                <ListItemText primary={name} />
              </MainListItemBtn>
            </Fragment>
          )
        )}
      </List>
    </div>
  );
  return (
    <Box component="nav" sx={{ width: { md: adminDrawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: adminDrawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: adminDrawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
