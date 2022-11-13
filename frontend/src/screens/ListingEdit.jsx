import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { ListingFormStyle, ListingInputStyle } from '../styles/ListingFormStyle';
import { navTo, makeRequest, fileToDataUrl } from '../helpers';
import BedRoomInput from '../components/BedRoomInput';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const ListingEditPage = (props) => {
  const path = props.path.replace('/hostedListing/', '')
  const info = JSON.parse(localStorage.getItem('hostListinginfo' + path));

  const [title, setTitle] = React.useState(info.title);
  const [type, setType] = React.useState(info.metadata.type);
  const [street, setStreet] = React.useState(info.address.street);
  const [city, setCity] = React.useState(info.address.city);
  const [state, setState] = React.useState(info.address.state);
  const [postcode, setPostcode] = React.useState(info.address.postcode);
  const [country, setCountry] = React.useState(info.address.country);
  const [price, setPrice] = React.useState(info.price);
  const [bathrooms, setBathrooms] = React.useState(info.metadata.bathrooms);
  let [thumbnail, setThumbnail] = React.useState(info.thumbnail);
  const [amenities, setAmen] = React.useState(info.metadata.amenities);
  const [bedrooms, setBedrooms] = React.useState(info.metadata.bedrooms);
  const [isFormCorrect, setFormCorrect] = React.useState(true);
  const [isLoading, setLoading] = React.useState(false);
  const [pics, setPics] = React.useState([]);
  const [houseNo, setHouseNo] = React.useState(info.address.houseNo);
  const [suburb, setSuburb] = React.useState(info.address.suburb);
  const bedroomList = [];

  for (let i = 0; i < bedrooms[0].length; i++) {
    bedroomList.push(<BedRoomInput brcounter={bedroomList.length} setBedrooms={setBedrooms} bedrooms={bedrooms} />)
  }

  // check the bedroom fields are all filled
  const checkBedroomFilled = () => {
    for (let i = 0; i < bedrooms[0].length; i++) {
      if (bedrooms[0][i] === '' || bedrooms[1][i] === '') {
        return false;
      }
    }
    return true;
  }

  const editListhandler = async () => {
    // check all the field is filled by the client
    if (title !== '' && type !== '' && street !== '' && city !== '' && state !== '' && postcode !== '' && suburb !== '' && houseNo !== '' &&
    country !== '' && price !== '' && bathrooms !== '' && thumbnail !== '' && amenities !== '' && checkBedroomFilled()) {
      // change file object to dataurl first
      if (thumbnail !== info.thumbnail) {
        thumbnail = await fileToDataUrl(thumbnail);
      }
      // construct the address field
      const address = { street, city, state, postcode, country, houseNo, suburb };

      setLoading(true);
      let picurlList = pics;
      if (pics.length !== 0) {
        picurlList = [];
        for (let i = 0; i < pics.length; i++) {
          const dataurl = await fileToDataUrl(pics[i]);
          picurlList.push(dataurl);
        }
      }

      // send the listing creation request to server
      const data = await makeRequest('/listings/' + path, 'PUT', {
        title, address, price, thumbnail, metadata: { bedrooms, amenities, bathrooms, type, published: info.metadata.published, picList: picurlList }
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

      {/* the form used to edit a specific listing info */}
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
        <div style={{ textAlign: 'center' }}><h6>change to a new Thumbnail</h6></div>
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
        </div>
        {bedroomList}

        <br />
        <div style={{ textAlign: 'center' }}><h6>change pictures of the house</h6></div>
        <ListingInputStyle><input type="file" multiple onChange={(event) => setPics(event.target.files)}/></ListingInputStyle>

        {!isFormCorrect &&
          <><br />
          <Alert severity="warning">You can not leave textboxs empty.</Alert></>
        }

        <br />
        <div style={{ textAlign: 'center' }}>
          {isLoading &&
            <LoadingButton loading variant="outlined">
            Submit
            </LoadingButton>
          }
          {!isLoading &&
            <Button style={{ 'margin-top': 10 + 'px' }} variant="contained" onClick={editListhandler}>Save changes</Button>
          }
        </div>
      </ListingFormStyle>
    </>
  );
}

export default ListingEditPage;

// use for linting purpose
ListingEditPage.propTypes = {
  path: PropTypes.string,
  token: PropTypes.string,
  nav: PropTypes.func
}
