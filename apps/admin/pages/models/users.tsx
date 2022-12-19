import { Paper, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridColDef } from '@mui/x-data-grid';
import Head from 'next/head';
import AdminLayout from 'layouts/admin';
import DataTable from 'ui/components/DataTable';
import { useQuery } from '@apollo/client';
import { GetUserByID, UsersQuery } from 'graphql/user';
import { AllUsersResult } from 'types/user';

export default function Users() {
  const { data } = useQuery(UsersQuery);
  const users = data?.users;

  const user = useQuery(
    GetUserByID,
    // variables are also typed!
    { variables: { userById: 1 } }
  );

  return (
    <AdminLayout>
      <Head>
        <title>Users</title>
      </Head>
      <Paper variant="outlined" sx={{ p: { md: 5, xs: 2 }, m: 0 }}>
        <Typography variant="h4" fontWeight={500} gutterBottom>
          Users
        </Typography>
        <Typography variant="body2" color={grey[700]}>
          Manage your users
        </Typography>
        <Toolbar />
        {users && <DataTable initialColumns={columns} initialRows={users} />}
      </Paper>
    </AdminLayout>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: true },
  { field: 'name', headerName: 'Name', width: 170, editable: true },
  { field: 'email', headerName: 'Email', width: 170, editable: true },
  {
    field: 'isActive',
    headerName: 'Active',
    type: 'boolean',
    width: 90,
    editable: true,
  },
];
