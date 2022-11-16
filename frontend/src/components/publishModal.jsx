// This is the publish modal that will appear once click upload button

import React from 'react';
import PropTypes from 'prop-types'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeRequest } from '../helpers';
import Alert from '@mui/material/Alert';

// this is the publish input element, whenever add another available time, push a new PublishInput to the publish modal
const PublishInput = (props) => {
  const [startDay, setSD] = React.useState('');
  const [startMonth, setSM] = React.useState('');
  const [startYear, setSY] = React.useState('');
  const [endDay, setED] = React.useState('');
  const [endMonth, setEM] = React.useState('');
  const [endYear, setEY] = React.useState('');

  return (
    <>
    <h6>Start Date:</h6>
    <div>
      <TextField
        style={{ width: 20 + '%' }}
        type='number'
        label="Day"
        id="outlined-size-small"
        size="small"
        value={startDay}
        onChange = {(event) => { setSD(event.target.value); props.ava[props.counter].day = event.target.value; props.setAva(props.ava) }}
      />
      <>&nbsp;&nbsp;</>
      <TextField
        style={{ width: 35 + '%' }}
        type='number'
        label="Month"
        id="outlined-size-small"
        size="small"
        value={startMonth}
        onChange = {(event) => { setSM(event.target.value); props.ava[props.counter].month = event.target.value; props.setAva(props.ava) }}
      />
      <>&nbsp;&nbsp;</>
      <TextField
      style={{ width: 30 + '%' }}
      type='number'
      label="Year"
      id="outlined-size-small"
      size="small"
      value={startYear}
      onChange = {(event) => { setSY(event.target.value); props.ava[props.counter].year = event.target.value; props.setAva(props.ava) }}
      />
    </div>
    <h6>End Date:</h6>
    <div>
      <TextField
        style={{ width: 20 + '%' }}
        type='number'
        label="Day"
        id="outlined-size-small"
        size="small"
        value={endDay}
        onChange = {(event) => { setED(event.target.value); props.ava[props.counter + 1].day = event.target.value; props.setAva(props.ava) }}
      />
      <>&nbsp;&nbsp;</>
      <TextField
        style={{ width: 35 + '%' }}
        type='number'
        label="Month"
        id="outlined-size-small"
        size="small"
        value={endMonth}
        onChange = {(event) => { setEM(event.target.value); props.ava[props.counter + 1].month = event.target.value; props.setAva(props.ava) }}
      />
      <>&nbsp;&nbsp;</>
      <TextField
        style={{ width: 30 + '%' }}
        type='number'
        label="Year"
        id="outlined-size-small"
        size="small"
        value={endYear}
        onChange = {(event) => { setEY(event.target.value); props.ava[props.counter + 1].year = event.target.value; props.setAva(props.ava) }}
      />
    </div>
    </>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal (props) {
  // The format of availablity will be [date1, date2, date3, date4] where date is an array contain(dd/mm/yy) itself
  const [availability, setAva] = React.useState([]);
  const [avaList, setAvaList] = React.useState([]);
  const [isInputCorrect, setInputbool] = React.useState(true);

  // add an input element for client every time client requests to add a new available time
  const getPubInput = () => {
    const counter = availability.length;
    availability.push({ day: '', month: '', year: '' });
    availability.push({ day: '', month: '', year: '' });
    setAvaList(avaList.concat(<PublishInput ava={availability} counter={counter} setAva={setAva} />))
  }

  // check the input and publish the listing
  const publishListing = async () => {
    // check the condition of the input
    // 1. check if no input is added
    if (availability.length === 0) {
      alert('You need to add available times.');
      return;
    }
    // 2. check any not filled element and any invalid day/month/year
    for (let i = 0; i < availability.length; i++) {
      if (availability[i].day === '' || availability[i].month === '' || availability[i].year === '') {
        setInputbool(false);
        return;
      }
      // check day
      if (parseInt(availability[i].day) < 0 || parseInt(availability[i].day) > 31) {
        alert('invalid day');
        return;
      }
      // check month
      if (parseInt(availability[i].month) < 1 || parseInt(availability[i].month) > 12) {
        alert('invalid month');
        return;
      }
      // check year
      if (parseInt(availability[i].year) < 2022) {
        alert('invalid year(should be 2022 onward)');
        return;
      }
    }

    // 3. check end date later than start date
    for (let i = 0; i < availability.length; i += 2) {
      const startDateVal = parseInt(availability[i].day) + 30 * parseInt(availability[i].month) + 365 * parseInt(availability[i].year);
      const EndDateVal = parseInt(availability[i + 1].day) + 30 * parseInt(availability[i + 1].month) + 365 * parseInt(availability[i + 1].year);
      if (startDateVal > EndDateVal) {
        alert('End date earlier than start date');
        return;
      }
    }

    // publish the listing
    const data = await makeRequest('/listings/publish/' + props.id, 'PUT', { availability }, props.token);
    if (data) {
      props.handleClose();
      props.setPublished(true);
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => { props.handleClose(); setAvaList([]); setAva([]); setInputbool(true) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ textAlign: 'center' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Set available times
          </Typography>
          <div>
            <button onClick={getPubInput}>add time</button>
            <br />
            <br />
          </div>

          {avaList}
          {!isInputCorrect &&
            <><br />
            <div style={{ textAlign: 'center' }}><Alert severity="warning" style={{ width: 100 + '%' }}>Invalid input</Alert></div></>
          }

          <br />
          <Button variant="contained" onClick={publishListing}>Publish</Button>
        </Box>
      </Modal>
    </div>
  );
}

// use for linting purpose
BasicModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
  id: PropTypes.number,
  token: PropTypes.string,
  setPublished: PropTypes.func
}

// use for linting purpose
PublishInput.propTypes = {
  ava: PropTypes.array,
  counter: PropTypes.number,
  setAva: PropTypes.func,
}
