/// <reference types="cypress" />

// To make the test work, please run the backend server before start the test. 
describe('user happy path', () => {
  let userEmail = '';
  it('should navigate to the home screen successfully', () => {
    // visit the frontend url
    cy.visit('localhost:3000');
    cy.url().should('include', 'localhost:3000');
  })

  it('should navigate to the register screen after click register button', () => {
    // get the register button from navigation bar
    cy.get('Button[name="regButton"]').click();
    // click the register button
    cy.url().should('include','localhost:3000/register');
  })

  it('should successfully register the form with correct information', () => {
    userEmail = '123' + Math.floor(Math.random() * 1000000) + '@test.com';
    // fill the reg form
    cy.get('input[placeholder="Enter name"').focus().type('testName');
    cy.get('input[placeholder="Enter email"').focus().type(userEmail);
    cy.get('input[placeholder="Enter Password"').focus().type('12345');
    cy.get('input[placeholder="Enter Password again"').focus().type('12345');

    // click the sign up button
    cy.get('Button[name="regFormSubmitButton"').click();

    // check it's back to the home page
    cy.get('Button[name="logOutButton"]').should('be.visible');
  })

  it('should navigate to a different screen once clicked mylistings button', () => {
    // click the mylistings button
    cy.get('Button[name="mylistingsButton"]').click();
    cy.url().should('include','localhost:3000/hostedListing');
  })

  it('should go into the add listing form after click the add listing button on the page', () => {
    // click the add listing button
    cy.get('Button[name="addlistingsButton"]').click();
    cy.contains('Listing info form');
  })

  it('should be able to add all the properties and click a button to add the new listing', () => {
    // fill the form and click the create button
    cy.get('input[name="createTitle"]').focus().type('test house ' + Math.floor(Math.random() * 1000000));
    cy.get('input[name= "createType"]').focus().type('test type');
    cy.get('input[name="createNumber"]').focus().type('123');
    cy.get('input[name="createStreet"]').focus().type('test ave');
    cy.get('input[name="createSuburb"]').focus().type('test kingsenton');
    cy.get('input[name="createCity"]').focus().type('test city');
    cy.get('input[name="createCountry"]').focus().type('test sydney');
    cy.get('input[name="createPostcode"]').focus().type('2800');
    cy.get('input[name="createState"]').focus().type('test state');
    cy.get('input[name="createPrice"]').focus().type('500');
    cy.get('input[name="createBathroom"]').focus().type('3');
    cy.get('textarea[name="createAmenities"]').focus().type('gym and swimming pool');
    cy.get('input[name="createThumbnail"]').selectFile("thumbnail1.PNG");
    cy.get('button[name="addBedroomButton"]').click();
    cy.get('input[name="createBedroomType"]').focus().type('test');
    cy.get('input[name="createBedroomNumber"]').focus().type('4');
    cy.get('Button[name="createListing"]').click();

    cy.wait(1000);
    // it should take user to the mylistings page
    cy.url().should('equal', 'http://localhost:3000/hostedListing');
  })

  it('should be able to edit the thumbnail and title successfully', () => {
    const newTitle = 'test house ' + Math.floor(Math.random() * 1000000);
    // click the edit button on the listing
    cy.get('button[aria-label="edit"]').click();

    //after click, change the thumbnail and title
    cy.get('input[name="EditThumbnail"]').selectFile("thumbnail2.PNG");
    cy.get('input[name="EditTitle"]').focus().type(newTitle);

    // click the confirm edit button
    cy.get('button[name="confirmEditButton"]').click();

    // now the hosted listing page should contain text "new title"
    cy.contains(newTitle);
  })

  it('should be able to publish the listing given a valid date range', () => {
    // click the publish button
    cy.get('button[aria-label="upload"]').click();
    // after click, fill in the available date range in the modal
    cy.get('button[name="addPublishtimeButton"]').click();
    cy.get('input[name="publishStartDD"]').focus().type('1');
    cy.get('input[name="publishStartMM"]').focus().type('1');
    cy.get('input[name="publishStartYY"]').focus().type('2022');
    cy.get('input[name="publishEndDD"]').focus().type('1');
    cy.get('input[name="publishEndMM"]').focus().type('1');
    cy.get('input[name="publishEndYY"]').focus().type('2023');

    //click the publish button
    cy.get('Button[name="publishModalButton"]').click();
  })

  it('should logout and register another user', () => {
    // click the log out button
    cy.get('Button[name="logOutButton"]').click();

    // click the register button
    cy.get('Button[name="regButton"]').click();

    // fill another reg form
    cy.get('input[placeholder="Enter name"').focus().type('testName2');
    cy.get('input[placeholder="Enter email"').focus().type('123' + Math.floor(Math.random() * 1000000) + '@test.com');
    cy.get('input[placeholder="Enter Password"').focus().type('12345');
    cy.get('input[placeholder="Enter Password again"').focus().type('12345');

    // click the sign up button
    cy.get('Button[name="regFormSubmitButton"').click();
  })

  it("should be able to make a booking of the orignal user's published listing", () => {
    cy.get('Button[name="listingInfoButton"]').first().click();

    // it should it the user to a serperate screen
    cy.url().should('include', '/Listing/');

    // Fill the booking form
    cy.get('input[name="bookingStartDD"]').focus().type('1');
    cy.get('input[name="bookingStartMM"]').focus().type('1');
    cy.get('input[name="bookingStartYY"]').focus().type('2022');
    cy.get('input[name="bookingEndDD"]').focus().type('1');
    cy.get('input[name="bookingEndMM"]').focus().type('2');
    cy.get('input[name="bookingEndYY"]').focus().type('2022');

    // click the booking button
    cy.get('Button[name="bookingConfirmButton"]').click();
  })

  it('should log out and log back in the original user', () => {
    // click the log out button
    cy.get('Button[name="logOutButton"]').click();

    // click the log in button
    cy.get('Button[name="logInButton"]').click();
    // This should take user to a seperate screen and sperate route
    cy.url().should('include', '/login');

    // fill the login form
    cy.get('input[placeholder="Enter email"]').focus().type(userEmail);
    cy.get('input[placeholder="Enter Password"]').focus().type('12345');

    // click the login button, then it should back to the dashboard
    cy.get('Button[name="submitloginButton"]').click();
    cy.url().should('include', '/')
  })

  it('should go to mylisting page and successfully unlist the listing that have been listed before', () => {
    // click the mylistings button
    cy.get('Button[name="mylistingsButton"]').click();
    cy.url().should('include','localhost:3000/hostedListing');
    cy.get('button[aria-label="unpublish"]').click();

    // now the unlist button has been clicked, the list button should appear
    cy.get('button[aria-label="upload"]').should('be.visible');
  })
  
})