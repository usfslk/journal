import '../layouts/bootstrap.min.css';
import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <div className="m-3 bg-white p-2" >
        <Navbar color="faded" light>
          <NavbarBrand href="/" className="mr-auto">
          Journal by Protobulb.io</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar className="ml-0 pt-3" >
             <NavItem>
                <NavLink href="/">Home</NavLink>
              </NavItem>
              <NavItem  className="pb-0">
                <NavLink href="https://protobulb.io">Bring your idea to life!</NavLink>
              </NavItem>  
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
