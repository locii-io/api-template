import { Paper, Toolbar, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { GridColDef } from "@mui/x-data-grid";
import Head from "next/head";
import { User } from "components/common/type";
import AdminLayout from "layouts/admin";
import DataTable from "ui/components/DataTable";

export default function Users() {
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
        <DataTable initialColumns={columns} initialRows={rows} />
      </Paper>
    </AdminLayout>
  );
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70, editable: true },
  { field: "name", headerName: "Name", width: 170, editable: true },
  { field: "email", headerName: "Email", width: 170, editable: true },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 90,
    editable: true,
  },
];

const rows: User[] = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    isActive: false,
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    isActive: true,
  },
  {
    id: 3,
    name: "Clementine Bauch",
    email: "Nathan@yesenia.net",
    isActive: true,
  },
  {
    id: 4,
    name: "Patricia Lebsack",
    email: "Julianne.OConner@kory.org",
    isActive: true,
  },
  {
    id: 5,
    name: "Chelsey Dietrich",
    email: "Lucio_Hettinger@annie.ca",
    isActive: true,
  },
  {
    id: 6,
    name: "Mrs. Dennis Schulist",
    email: "Karley_Dach@jasper.info",
    isActive: true,
  },
  {
    id: 7,
    name: "Kurtis Weissnat",
    email: "Telly.Hoeger@billy.biz",
    isActive: true,
  },
  {
    id: 8,
    name: "Nicholas Runolfsdottir V",
    email: "Sherwood@rosamond.me",
    isActive: true,
  },
  {
    id: 9,
    name: "Glenna Reichert",
    email: "Chaim_McDermott@dana.io",
    isActive: true,
  },
  {
    id: 10,
    name: "Clementina DuBuque",
    email: "Rey.Padberg@karina.biz",
    isActive: false,
  },
];
