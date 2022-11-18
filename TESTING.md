-   Component testing: 
I tested the navigation bar, login form and the filter component using the component testing method. 
1. The login form is just to testing the basic fucntionalities such as click the button, fill in the form and back to main page button. I used some mock function to mock the abilities.
2. For navigation bar, situation will vary depends on the present of token, therefore I mock a empty token in the first case and test the existence of buttons such as "login" and "register". Then I mocked a valid button pass it as a prop into the navigation bar to see the existence of other buttons such as "log out" and "mylistings".

- UI testing:
Because I work as solo, therefore I only followed the happy path described in the spec.
To do this, I firstly let the cy to visit the frontend server, then check whether there is a register button using cy.get, then trigger the click operation. After that, I gave each input a specific name so using the name to get all the input fields then get the button to submit registration form. To prove the registration has been done successfully, check whether the user are currently in the dashboard, using url() to check that. The following steps are similar to this register checking. 
All the cy function I used were .url() .should() .contains() .get() .focus().type() .click()
