import * as React from 'react';
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import AdminLayout from '../layouts/admin';
import ApiIcon from '@mui/icons-material/Api';
import { GraphqlIcon } from '../assets/icons/graphql';
import Head from 'next/head';

export default function AdminDashboard() {
  const openGraphqlPlayground = () => {
    if (window) {
      window.open('http://localhost:4000/graphql', '_blank');
    }
  };
  const openAPIDocs = () => {
    if (window) {
      window.open('http://localhost:4000/api-docs', '_blank');
    }
  };
  return (
    <AdminLayout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Paper variant="outlined" sx={{ p: 5 }}>
        <Typography variant="h4" fontWeight={500}>
          Get started with App
        </Typography>
        <Typography variant="subtitle1" color={grey[600]}>
          Follow the guide for the fastest to get set up
        </Typography>
        <Toolbar />
        <Typography gutterBottom variant="h5" fontWeight={500}>
          The Essentials
        </Typography>
        {/* Graphql API */}
        <Divider sx={{ my: 4 }} />
        <Stack
          direction={{ md: 'row', xs: 'column' }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={4} alignItems="center">
            <GraphqlIcon sx={{ fontSize: 50, color: '#E10098' }} />
            <Box>
              <Typography gutterBottom variant="h6" fontWeight={500}>
                Graphql API
              </Typography>
              <Typography variant="subtitle1" color={grey[600]}>
                Let users access their info from graphql playground.
              </Typography>
            </Box>
          </Stack>
          <Stack alignItems="center" spacing={1}>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              disableElevation
              onClick={openGraphqlPlayground}
            >
              View Playground
            </Button>
            <Link underline="hover" onClick={openGraphqlPlayground}>
              View Documentation
            </Link>
          </Stack>
        </Stack>
        {/* Rest API */}
        <Divider sx={{ my: 4 }} />
        <Stack
          direction={{ md: 'row', xs: 'column' }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={4} alignItems="center">
            <ApiIcon color="primary" sx={{ fontSize: 50 }} />
            <Box>
              <Typography gutterBottom variant="h6" fontWeight={500}>
                Rest API
              </Typography>
              <Typography variant="subtitle1" color={grey[600]}>
                Learn and test available endpoints with Swagger API
                documentation
              </Typography>
            </Box>
          </Stack>
          <Stack alignItems="center" spacing={1}>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              disableElevation
              onClick={openAPIDocs}
            >
              Swagger API
            </Button>
            <Link underline="hover" onClick={openAPIDocs}>
              View Documentation
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </AdminLayout>
  );
}
