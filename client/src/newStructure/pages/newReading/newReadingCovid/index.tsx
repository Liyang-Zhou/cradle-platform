import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Demographics } from './demographic';
import { Symptoms } from './symptoms';
import { VitalSignAssessment } from './vitalSignAssessment';
import { Assessment } from './assessment';
import { bindActionCreators } from 'redux';
import { getCurrentUser } from '../../../shared/reducers/user/currentUser';
import {
  addNewReading,
  resetNewReadingStatus,
} from '../../../shared/reducers/newReadingStatus';
import { addNewPatient } from '../../../shared/reducers/patients';
import { User } from '@types';
import { initialUrineTests } from '../urineTestForm';
import { useNewPatient } from './demographic/hooks';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
    },
    formField: {
      margin: theme.spacing(2),
      minWidth: '22ch',
    },
    backButton: {
      margin: theme.spacing(2),
    },
    nextButton: {
      margin: theme.spacing(2),
      float: 'right',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);
function getSteps() {
  return [
    'Collect basic demographic info',
    'Collect symptoms',
    'Vitals sign assessment',
    'Assessment',
  ];
}
interface IProps {
  getCurrentUser: any;
  afterNewPatientAdded: any;
  user: User;
  addNewReading: any;
}

const initState = {
  reading: {
    userId: '',
    readingId: '',
    dateTimeTaken: null,
    bpSystolic: '',
    bpDiastolic: '',
    heartRateBPM: '',
    dateRecheckVitalsNeeded: null,
    isFlaggedForFollowup: false,
    symptoms: '',
    urineTests: initialUrineTests,
  },
  vitals: {
    dateTimeTaken: null,
    bpSystolic: '',
    bpDiastolic: '',
    heartRateBPM: '',
    raspiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    dateRecheckVitalsNeeded: null,
    isFlaggedForFollowup: false,
  },
  symptoms: {
    none: true,
    headache: false,
    bleeding: false,
    blurredVision: false,
    feverish: false,
    abdominalPain: false,
    unwell: false,
    other: false,
    cough: false,
    shortnessBreath: false,
    soreThroat: false,
    muscleAche: false,
    fatigue: false,
    lossOfSense: false,
    lossOfTaste: false,
    lossOfSmell: false,
    otherSymptoms: '',
  },
  showSuccessReading: false,
  hasUrineTest: false,
};
const Page: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [state, setState] = React.useState(initState);
  const { patient, handleChangePatient } = useNewPatient();
  //make use state hook for each field group
  const steps = getSteps();

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      props.getCurrentUser();
    }
  });

  const handleUrineTestChange = (e: any, value: any) => {
    setState({
      ...state,
      reading: {
        ...state.reading,
        urineTests: {
          ...state.reading.urineTests,
          [value.name]: value.value,
        },
      },
    });
  };

  const handleUrineTestSwitchChange = (e: any) => {
    console.log(e.target.checked);
    setState({
      hasUrineTest: e.target.checked,
    } as any);
    if (!e.target.checked) {
      setState({
        ...state,
        reading: {
          ...state.reading,
          urineTests: initialUrineTests,
        },
      });
    }
  };
  const handlSymptomsChange = (e: any) => {
    if (e.target.name === 'none' && e.target.checked) {
      setState({
        ...state,
        symptoms: initState.symptoms,
      });
    }
    if (e.target.name === 'otherSymptoms') {
      setState({
        ...state,
        symptoms: {
          ...state.symptoms,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setState({
        ...state,
        symptoms: {
          ...state.symptoms,
          [e.target.name]: e.target.checked,
        },
      });
    }
  };

  const handlVitals = (e: any) => {
    setState({
      ...state,
      vitals: {
        ...state.vitals,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div
      style={{
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
      <h1 style={{ textAlign: 'center' }}>
        <b>Create a New Reading</b>
      </h1>
      <Divider />
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 ? (
        <Demographics
          patient={patient}
          onChange={handleChangePatient}></Demographics>
      ) : (
        ''
      )}
      {activeStep === 1 ? (
        <Symptoms
          symptoms={state.symptoms}
          onChange={handlSymptomsChange}></Symptoms>
      ) : (
        ''
      )}
      {activeStep === 2 ? (
        <VitalSignAssessment
          vitals={state.vitals}
          hasUrineTest={state.hasUrineTest}
          reading={state.reading}
          onChange={handlVitals}
          handleUrineTestChange={handleUrineTestChange}
          handleUrineTestSwitchChange={
            handleUrineTestSwitchChange
          }></VitalSignAssessment>
      ) : (
        ''
      )}
      {activeStep === 3 ? <Assessment></Assessment> : ''}
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}>
                Back
              </Button>
              <Button
                className={classes.nextButton}
                variant="contained"
                color="primary"
                onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = ({ user, newReadingStatus, patients }: any) => ({
  user: user.current.data,
  createReadingStatusError: newReadingStatus.error,
  readingCreated: newReadingStatus.readingCreated,
  newReadingData: newReadingStatus.message,
  newPatientAdded: patients.newPatientAdded,
});

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getCurrentUser,
      addNewReading,
      addNewPatient,
      resetNewReadingStatus,
      // afterNewPatientAdded
    },
    dispatch
  ),
});
export const NewReadingCovid = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
