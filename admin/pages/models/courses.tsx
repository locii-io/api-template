import * as React from 'react';
import { Paper, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridColDef } from '@mui/x-data-grid';
import Head from 'next/head';
import DataTable from '../../components/DataTable/dataTable';
import AdminLayout from '../../layouts/admin';

export interface Course {
  id: number;
  name: string;
  point: number;
}

export default function Courses() {
  return (
    <AdminLayout>
      <Head>
        <title>Courses</title>
      </Head>
      <Paper variant="outlined" sx={{ p: { md: 5, xs: 2 }, m: 0 }}>
        <Typography variant="h4" fontWeight={500} gutterBottom>
          Courses
        </Typography>
        <Typography variant="body2" color={grey[700]}>
          Manage your courses
        </Typography>
        <Toolbar />
        <DataTable initialColumns={columns} initialRows={rows} />
      </Paper>
    </AdminLayout>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: true },
  { field: 'name', headerName: 'Course name', width: 230, editable: true },
  {
    field: 'point',
    headerName: 'Point',
    type: 'number',
    width: 90,
    editable: true,
  },
];

const rows: Course[] = [
  { id: 1, name: 'Learn How to Code', point: 35 },
  { id: 2, name: 'Kubernetes', point: 42 },
  { id: 3, name: 'Docker Course', point: 45 },
  { id: 4, name: 'Learn Three.js', point: 16 },
  { id: 5, name: 'Vitejs React', point: 100 },
  { id: 6, name: 'Learn This', point: 150 },
  { id: 7, name: 'Clifford', point: 44 },
  { id: 8, name: 'Frances', point: 36 },
  { id: 9, name: 'Roxie', point: 65 },
];
