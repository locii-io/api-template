import { Paper, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridColDef } from '@mui/x-data-grid';
import Head from 'next/head';
import { Course } from 'common/type';
import DataTable from 'ui/components/DataTable';
import AdminLayout from 'layouts/admin';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COURSE, DELETE_COURSE, GET_ALL_COURSES, UPDATE_COURSE } from 'graphql/course';
import { CoursesQuery } from 'graphql/__generated__/graphql';

export default function Courses() {
  const courseQuery = useQuery(GET_ALL_COURSES, {});

  const courses = courseQuery.data?.courses;

  const [createCourse, createCourseState] = useMutation(CREATE_COURSE);
  const [updateCourse, updateCourseState] = useMutation(UPDATE_COURSE);
  const [deleteCourse, deleteCourseState] = useMutation(DELETE_COURSE);

  const handleCreateUser = async ({
    name,
    points,
  }: NonNullable<CoursesQuery['courses'][number]>) => {
    const { data } = await createCourse({ variables: { name, points, userId: 1 } });
    return data?.createCourse;
  };

  const handleUpdateUser = async ({
    id,
    name,
    points,
  }: NonNullable<CoursesQuery['courses'][number]>) => {
    const { data } = await updateCourse({ variables: { updateCourseId: id, name, points } });
    return data?.updateCourse;
  };

  const handleDeleteUser = async (id: number) => {
    const { data } = await deleteCourse({ variables: { deleteCourseId: id } });
  };

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
        {courses && (
          <DataTable
            initialColumns={columns}
            initialRows={courses}
            emptyRecords={{ name: '', points: 0 }}
            handleCreateRow={handleCreateUser}
            handleDeleteRow={handleDeleteUser}
            handleUpdateRow={handleUpdateUser}
            loading={
              courseQuery.loading ||
              createCourseState.loading ||
              updateCourseState.loading ||
              deleteCourseState.loading
            }
          />
        )}
      </Paper>
    </AdminLayout>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: true },
  { field: 'name', headerName: 'Course name', width: 230, editable: true },
  {
    field: 'points',
    headerName: 'Point',
    type: 'number',
    width: 90,
    editable: true,
  },
];
