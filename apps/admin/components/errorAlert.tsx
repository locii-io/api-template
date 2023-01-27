import { Alert, AlertTitle, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const ErrorAlert = ({ error }: { error: any }) => (
  <Alert severity="error">
    <AlertTitle>{error.name || 'ERROR'}</AlertTitle>
    <Grid>
      {[error, ...(error?.networkError?.result?.errors || [])].map((err: any, index) => (
        <Typography key={index} variant="body2" color={grey[700]}>
          {err.message}
        </Typography>
      ))}
    </Grid>
  </Alert>
);

export default ErrorAlert;
