import React from 'react';
import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import Topbar from './components/Topbar';
import LoginPage from './screens/LoginPage';
import Dashboard from './screens/Dashboard';

// 1. Test login form
describe('back to dashboard button', () => {
  it('has a button and has text back on it', () => {
    render(<LoginPage />);
    // expect a back button
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    // click the button will take user to the dashboard, which will has an airBrB text and a Listing title text
  });

  it('has a form and a submit button', () => {
    render(<LoginPage />);
    const loginPage = shallow((<LoginPage />));
    const form = loginPage.find('Form');
    expect(form).toHaveLength(1);
    // find the div that include the button
    const submitButtondiv = form.find('div').at(1);
    expect(submitButtondiv).toHaveLength(1);
  });
});

// 2. Test the behavior of topbar which is the top navigate bar contains serveral items
describe('Topbar', () => {
  it('shows a login button and register button when no token is passed in', () => {
    render(<Topbar />);
    // expect a login button
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    // expect a Register button
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('has an AirBrb text inside it', () => {
    render(<Topbar />);
    // expect a airBrb text
    expect(screen.getByText('AirBrB')).toBeInTheDocument();
  })

  it('shows different info when token is passed in', () => {
    // pass a token prop and test the properties
    render(<Topbar token='a random valid token' pathname='random'/>);
    // expect a logout button no matter the pathname
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  })

  it('shows mylistings when at dashboard', () => {
    // pass a token and pathname prop and test the properties
    render(<Topbar token='a random valid token' pathname='/'/>);
    // expect a logout button no matter the pathname
    expect(screen.getByRole('button', { name: 'Mylistings' })).toBeInTheDocument();
  })

  it('shows dashboard when at hostedlisting page, shows mylistings when at dashboard', () => {
    // pass a token and pathname prop and test the properties
    render(<Topbar token='a random valid token' pathname='/hostedListing'/>);
    // expect a logout button no matter the pathname
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  })
})

// 3. Test filter props
describe('Filter', () => {
  it('has a button and filter text on it on the dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('has a "filter by" text on the dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText('Filter by:')).toBeInTheDocument();
  });

  it('has a select box to select different filters', () => {
    render(<Dashboard />);
    expect(screen.getByText('None')).toBeInTheDocument();
    screen.getByText('None');
  })
}); 
