// This is the filter section shown on the dashboard.
import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

const Filter = (props) => {
  const [filterType, setFType] = React.useState('None');
  const [minBed, setMinbed] = React.useState(null);
  const [maxBed, setMaxbed] = React.useState(null);
  const [minprice, setMinprice] = React.useState(null);
  const [maxprice, setMaxprice] = React.useState(null);
  const [startdd, setStartdd] = React.useState(null);
  const [startmm, setStartmm] = React.useState(null);
  const [startyy, setStartyy] = React.useState(null);
  const [enddd, setEnddd] = React.useState(null);
  const [endmm, setEndmm] = React.useState(null);
  const [endyy, setEndyy] = React.useState(null);
  const [string, setString] = React.useState(null);
  const [rating, setRating] = React.useState(null);

  // submit the filter result to let listing page process
  const submitFilter = () => {
    // reset the filter
    if (filterType === 'None') {
      props.setFilter(['None']);
    }

    // if filter type is bedroom, check minBed and maxBed
    if (filterType === 'bedrooms') {
      if (minBed !== null && maxBed !== null) {
        const Filter = ['bedrooms', minBed, maxBed];
        props.setFilter(Filter);
      } else {
        alert('please fill all the inputs')
      }
    }

    // if filter type is date, check start and end date
    if (filterType === 'date') {
      if (startdd !== null && startmm !== null && startyy !== null && enddd !== null && endmm !== null && endyy !== null) {
        // end date can not be earlier than start date
        const startDateVal = parseInt(startdd) + 30 * parseInt(startmm) + 365 * parseInt(startyy);
        const EndDateVal = parseInt(enddd) + 30 * parseInt(endmm) + 365 * parseInt(endyy);
        if (EndDateVal < startDateVal) {
          alert('end date can not be earlier than start date');
        }
        const Filter = ['date', startdd, startmm, startyy, enddd, endmm, endyy];
        props.setFilter(Filter);
      } else {
        alert('please fill all the inputs')
      }
    }

    // if filter type is price, check min and max price
    if (filterType === 'price') {
      if (minprice !== null && maxprice !== null) {
        const Filter = ['price', minprice, maxprice];
        props.setFilter(Filter);
      } else {
        alert('please fill all the inputs')
      }
    }

    // if filter type is text, check text is null
    if (filterType === 'text') {
      if (string !== null) {
        const Filter = ['text', string];
        props.setFilter(Filter);
      } else {
        alert('please fill all the inputs')
      }
    }

    // if filter type is rating, check order option is checked
    if (filterType === 'rating') {
      if (rating !== null) {
        const Filter = ['price', rating];
        props.setFilter(Filter);
      } else {
        alert('please fill all the inputs')
      }
    }
  }
  return (
    <>
      <div style={{
        paddingLeft: 10 + 'px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      <h6>Filter by:</h6>
      <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <Select
      value={filterType}
      onChange={(event) => { setFType(event.target.value) }}
      >
      <MenuItem value='None'>None</MenuItem>
      <MenuItem value='text'>Text</MenuItem>
      <MenuItem value='bedrooms'>Bedroom number</MenuItem>
      <MenuItem value='date'>Date range</MenuItem>
      <MenuItem value='price'>Price</MenuItem>
      <MenuItem value='rating'>Ratings</MenuItem>
      </Select>
      </FormControl>

      {filterType === 'text' &&
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: 200 },
      }}
      noValidate
      autoComplete="off"
      > <TextField
      id="outlined-basic"
      type='text'
      label="text"
      variant="outlined"
      size='small'
      value={string}
      onChange={(event) => setString(event.target.value)}
      />
      </Box>
      }

      {filterType === 'rating' &&
      <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Rating order</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={rating}
        onChange={(event) => { setRating(event.target.value) }}
      >
        <FormControlLabel value="high to low" control={<Radio />} label="high to low" />
        <FormControlLabel value="low to high" control={<Radio />} label="low to high" />
      </RadioGroup>
      </FormControl>
      }

      {filterType === 'bedrooms' &&
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: 70 },
      }}
      noValidate
      autoComplete="off"
      > <TextField
      id="outlined-basic"
      type='number'
      label="min"
      variant="outlined"
      size='small'
      value={minBed}
      onChange={(event) => setMinbed(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="max"
      variant="outlined"
      size='small'
      value={maxBed}
      onChange={(event) => setMaxbed(event.target.value)}
      />
      </Box>
      }

      {filterType === 'price' &&
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: 70 },
      }}
      noValidate
      autoComplete="off"
      >
      <TextField
      id="outlined-basic"
      type='number'
      label="min"
      variant="outlined"
      size='small'
      value={minprice}
      onChange={(event) => setMinprice(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="max"
      variant="outlined"
      size='small'
      value={maxprice}
      onChange={(event) => setMaxprice(event.target.value)}
      />
      </Box>
      }

      {filterType === 'date' &&
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: 80 },
      }}
      noValidate
      autoComplete="off"
      >
      <h6>Start:</h6>
      <TextField
      id="outlined-basic"
      type='number'
      label="DD"
      variant="outlined"
      size='small'
      value={startdd}
      onChange={(event) => setStartdd(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="MM"
      variant="outlined"
      size='small'
      value={startmm}
      onChange={(event) => setStartmm(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="YYYY"
      variant="outlined"
      size='small'
      value={startyy}
      onChange={(event) => setStartyy(event.target.value)}
      />

      <h6>End:</h6>
      <TextField
      id="outlined-basic"
      type='number'
      label="DD"
      variant="outlined"
      size='small'
      value={enddd}
      onChange={(event) => setEnddd(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="MM"
      variant="outlined"
      size='small'
      value={endmm}
      onChange={(event) => setEndmm(event.target.value)}
      />
      <TextField
      id="outlined-basic"
      type='number'
      label="YYYY"
      variant="outlined"
      size='small'
      value={endyy}
      onChange={(event) => setEndyy(event.target.value)}
      />
      </Box>
      }

      <Button variant="contained" onClick={submitFilter}>Filter</Button>

      </div>
    </>
  )
}

export default Filter;

Filter.propTypes = {
  setFilter: PropTypes.func,
}
