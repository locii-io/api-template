import { Container, Grid } from '@mui/material';
import Login from 'components/auth/login';
import ErrorAlert from 'components/errorAlert';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const error = router?.query?.error && JSON.parse(router?.query?.error);

  return (
    <Container
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          {error && <ErrorAlert error={error} />}
          <Login />
        </Grid>
      </Grid>
    </Container>
  );
}
