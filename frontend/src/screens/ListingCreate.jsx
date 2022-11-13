import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { navTo, fileToDataUrl, makeRequest } from '../helpers';
import { ListingFormStyle, ListingInputStyle } from '../styles/ListingFormStyle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import BedRoomInput from '../components/BedRoomInput';

const ListingCreate = (props) => {
  // set all the form variables
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('');
  const [bedroomList, setbrList] = React.useState([]);
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [houseNo, setHouseNo] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [amenities, setAmen] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState([[], []]);
  const [isFormCorrect, setFormCorrect] = React.useState(true);
  const [isLoading, setLoading] = React.useState(false);

  // add another bedroom info input field
  const addbedroom = () => {
    setbrList(bedroomList.concat(<BedRoomInput brcounter={bedroomList.length} setBedrooms={setBedrooms} bedrooms={bedrooms}/>))
  }

  // check the bedroom fields are all filled
  const checkBedroomFilled = () => {
    if (bedrooms[0].length === 0 || bedrooms[1].length === 0) {
      return false;
    }

    if (bedrooms[0].length !== bedrooms[1].length) {
      return false;
    }

    for (let i = 0; i < bedrooms[0].length; i++) {
      if (bedrooms[0][i] === '' || bedrooms[1][i] === '') {
        return false;
      }
    }
    return true;
  }

  const createListhandler = async () => {
    // check all the field is filled by the client
    if (title !== '' && type !== '' && street !== '' && city !== '' && state !== '' && postcode !== '' &&
    country !== '' && price !== '' && bathrooms !== '' && thumbnail !== '' && amenities !== '' && checkBedroomFilled()) {
      // change file object to dataurl first
      const dataurl = await fileToDataUrl(thumbnail);
      // construct the address field
      const address = { street, city, state, postcode, country, suburb, houseNo };

      setLoading(true);
      // send the listing creation request to server
      const data = await makeRequest('/listings/new', 'POST', {
        title, address, price, thumbnail: dataurl, metadata: { bedrooms, amenities, bathrooms, type, published: false, picList: '' }
      }, props.token);
      if (data) {
        navTo(props.nav, '/hostedListing');
      } else {
        setLoading(false);
      }
    } else {
      // set the form is filled incorrectly, some fields are empty
      setFormCorrect(false);
    }
  }

  return (
    <>
      <div><Button style={{ 'margin-left': 10 + 'px', 'margin-top': 10 + 'px' }} size='medium' variant="contained" onClick= { () => { navTo(props.nav, '/hostedListing') } } >Back</Button></div>
      <br />
      <br />

    {/* the form used to create a new listing */}
      <ListingFormStyle>
        <div style={{ textAlign: 'center' }}><h4>Listing info form</h4></div>
        <br />

        <div style={{ textAlign: 'center' }}><h6>Basic info</h6></div>
        <ListingInputStyle>
          <TextField
            label="title"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />

          <TextField
            label="property type"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setType(event.target.value)}
            value={type}
          />
        </ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}><h6>address</h6></div>
        <ListingInputStyle>
          <TextField
            label="house number"
            type="number"
            variant="filled"
            size='small'
            onChange={(event) => setHouseNo(event.target.value)}
            value={houseNo}
          />

          <TextField
            label="street"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setStreet(event.target.value)}
            value={street}
          />

          <TextField
            label="suburb"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setSuburb(event.target.value)}
            value={suburb}
          />

          <TextField
            label="city"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setCity(event.target.value)}
            value={city}
          />

          <TextField
            label="state"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setState(event.target.value)}
            value={state}
          />

          <TextField
            label="postcode"
            type="number"
            variant="filled"
            size='small'
            onChange={(event) => setPostcode(event.target.value)}
            value={postcode}
          />

          <TextField
            label="country"
            type="text"
            variant="filled"
            size='small'
            onChange={(event) => setCountry(event.target.value)}
            value={country}
          />
        </ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}><h6>price per night</h6></div>
        <ListingInputStyle>
          <TextField
            label="amount"
            type="number"
            variant="filled"
            size='small'
            onChange={(event) => setPrice(event.target.value)}
            value={price}
          />
        </ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}><h6>numbers of bathrooms</h6></div>
        <ListingInputStyle>
          <TextField
            label="amount"
            type="number"
            variant="filled"
            size='small'
            onChange={(event) => setBathrooms(event.target.value)}
            value={bathrooms}
          />
        </ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}><h6>Thumbnail</h6></div>
        <ListingInputStyle><input type="file" onChange={(event) => setThumbnail(event.target.files[0])}/></ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}><h6>Amenities</h6></div>
        <ListingInputStyle>
          <textarea
          style={{ width: 30 + 'vw', height: 10 + 'vw' }}
          placeholder='Describe all the amenities here.'
          onChange={(event) => setAmen(event.target.value)}
          value={amenities}>
          </textarea>
        </ListingInputStyle>

        <br />
        <div style={{ textAlign: 'center' }}>
          <h6>properties of bedrooms</h6>
          <button onClick={addbedroom}>add a bedroom</button>
          <br />
        </div>
        {bedroomList}

        {!isFormCorrect &&
          <><br />
          <Alert severity="warning">Please fill all the fields</Alert></>
        }

        <br />
        <div style={{ textAlign: 'center' }}>
          {isLoading &&
            <LoadingButton loading variant="outlined">
            Submit
            </LoadingButton>
          }
          {!isLoading &&
            <Button style={{ 'margin-top': 10 + 'px' }} variant="contained" onClick={createListhandler}>Create</Button>
          }
        </div>
      </ListingFormStyle>
    </>
  );
}

export default ListingCreate;

// use for linting purpose
ListingCreate.propTypes = {
  nav: PropTypes.func,
  token: PropTypes.string
}
