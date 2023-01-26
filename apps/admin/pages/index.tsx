import { Container, Grid } from '@mui/material';
import Login from 'components/auth/login';

export default function Home() {
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
          <Login />
        </Grid>
      </Grid>
    </Container>
  );
}
