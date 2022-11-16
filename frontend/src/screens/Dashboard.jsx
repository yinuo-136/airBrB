// Dashboard(Listing page) is the default page which shows all the listings.
import React from 'react';
import PropTypes from 'prop-types';
import ListingElement from '../components/ListingElement';
import { makeRequest } from '../helpers';
import Filter from '../components/Filter';

const Dashboard = (props) => {
  const [ListingList, setListingList] = React.useState([]);
  const [filterOption, setFilterOption] = React.useState([]);
  const [isListingEmpty, setListingEmpty] = React.useState(false);

  // call a function to render all the list elements every first time enter the dashboard
  // or logout or when filter resets
  React.useEffect(async () => {
    const data = await makeRequest('/listings', 'GET', undefined, props.token);
    const InfoList = [];
    const InfoListBooked = [];
    const newListing = [];
    if (data) {
      for (let i = 0; i < data.listings.length; i++) {
        // set a bool to trace if the user used date range filter to get the result
        let isUseDate = false;
        let numdays = 0;
        const listingInfo = data.listings[i];
        // filter the listing that is made by the current user
        if (listingInfo.owner === props.email) {
          continue;
        }
        // filter the listing that hasn't been published
        const Info = await makeRequest('/listings/' + listingInfo.id, 'GET', undefined, props.token);
        if (!Info.listing.published) {
          continue;
        }

        // check the string if use string filter
        if (filterOption[0] === 'text') {
          const string = filterOption[1];
          if (!Info.listing.title.toLowerCase().includes(string.toLowerCase()) && !Info.listing.address.city.toLowerCase().includes(string.toLowerCase())) {
            continue;
          }
        }

        // check the bedroom number if use bedrooms filter
        if (filterOption[0] === 'bedrooms') {
          const minBed = filterOption[1];
          const maxBed = filterOption[2];
          if (Info.listing.metadata.bedrooms[0].length > maxBed || Info.listing.metadata.bedrooms[0].length < minBed) {
            continue;
          }
        }

        // check the bedroom number if use price filter
        if (filterOption[0] === 'price') {
          const minPrice = filterOption[1];
          const maxPrice = filterOption[2];
          if (parseInt(Info.listing.price) > maxPrice || parseInt(Info.listing.price) < minPrice) {
            continue;
          }
        }

        // check the date range if use date filter
        if (filterOption[0] === 'date') {
          isUseDate = true;
          let inRange = false;
          const startdd = filterOption[1];
          const startmm = filterOption[2];
          const startyy = filterOption[3];
          const enddd = filterOption[4];
          const endmm = filterOption[5];
          const endyy = filterOption[6];
          // transfer aimed dates into value
          const expstartDateVal = parseInt(startdd) + 30 * parseInt(startmm) + 365 * parseInt(startyy);
          const expEndDateVal = parseInt(enddd) + 30 * parseInt(endmm) + 365 * parseInt(endyy);
          numdays = expEndDateVal - expstartDateVal;
          const ava = Info.listing.availability;
          for (let i = 0; i < ava.length; i += 2) {
            const startDateVal = parseInt(ava[i].day) + 30 * parseInt(ava[i].month) + 365 * parseInt(ava[i].year);
            const EndDateVal = parseInt(ava[i + 1].day) + 30 * parseInt(ava[i + 1].month) + 365 * parseInt(ava[i + 1].year);
            // compare the date value
            if (startDateVal <= expstartDateVal && EndDateVal >= expEndDateVal) {
              inRange = true;
              break;
            }
          }
          if (inRange === false) {
            continue;
          }
        }
        Info.listing.id = listingInfo.id;
        Info.listing.isUseDate = isUseDate;
        Info.listing.dateDiff = numdays;

        // put the listing with status pending/accepted at the front
        if (props.token !== null) {
          const bookingInfo = await makeRequest('/bookings', 'GET', undefined, props.token);
          if (bookingInfo) {
            let isFind = false;
            for (let i = 0; i < bookingInfo.bookings.length; i++) {
              if (bookingInfo.bookings[i].owner === props.email && parseInt(bookingInfo.bookings[i].listingId) === listingInfo.id) {
                if (bookingInfo.bookings[i].status === 'pending' || bookingInfo.bookings[i].status === 'accepted') {
                  InfoListBooked.push(Info.listing);
                  isFind = true;
                  break;
                }
              }
            }
            if (!isFind) {
              InfoList.push(Info.listing);
            }
          }
        } else {
          InfoList.push(Info.listing);
        }
      }
      // sort lists
      InfoListBooked.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      InfoList.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });

      // add the info to array for dom construction
      for (let i = 0; i < InfoListBooked.length; i++) {
        newListing.push(<ListingElement info={InfoListBooked[i]} nav={props.nav} setListingInfo={props.setlistingInfo} email={props.email} token={props.token} hasbooked='booked'/>);
      }
      for (let i = 0; i < InfoList.length; i++) {
        newListing.push(<ListingElement info={InfoList[i]} nav={props.nav} setListingInfo={props.setlistingInfo} email={props.email} token={props.token}/>);
      }
      if (InfoListBooked.length === 0 && InfoList.length === 0) {
        setListingEmpty(true);
      } else {
        setListingEmpty(false);
      }
      setListingList(newListing);
    }
  }, [props.email, filterOption])

  return (
    <>
      <Filter setFilter={setFilterOption}/>
      <h3 style={{ textAlign: 'center' }}>Listings</h3>
      <br />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 5 + 'vw',
        justifyContent: 'space-evenly'
      }}>
        {ListingList}
      </div>
      {isListingEmpty &&
        <h4 style={{ textAlign: 'center' }}>Sorry, no available listings at this time.</h4>
      }
    </>
  );
}

export default Dashboard

Dashboard.propTypes = {
  token: PropTypes.string,
  nav: PropTypes.func,
  email: PropTypes.string,
  setlistingInfo: PropTypes.func
}
