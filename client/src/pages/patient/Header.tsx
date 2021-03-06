import React from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  Grid,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AddIcon from '@material-ui/icons/Add';
import { goBackWithFallback } from 'src/shared/utils';
import { Patient } from 'src/shared/types';
import Skeleton from '@material-ui/lab/Skeleton';
import { useHistory } from 'react-router-dom';

interface IProps {
  patient?: Patient;
}

export const Header = ({ patient }: IProps) => {
  const history = useHistory();
  const handleAddReadingClick = () => {
    if (patient) {
      history.push(`/readings/new/${patient.patientId}`);
    }
  };

  return (
    <Grid container justify="space-between">
      <Grid item>
        <Grid container alignItems="center">
          <Tooltip title="Go back" placement="top">
            <IconButton onClick={() => goBackWithFallback('/patients')}>
              <ChevronLeftIcon color="inherit" fontSize="large" />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">
            {patient ? (
              `Patient Summary for ${patient.patientName}`
            ) : (
              <Skeleton width={500} />
            )}
          </Typography>
        </Grid>
      </Grid>
      <Button
        color="primary"
        variant="contained"
        onClick={handleAddReadingClick}>
        <AddIcon />
        Add New Reading
      </Button>
    </Grid>
  );
};
