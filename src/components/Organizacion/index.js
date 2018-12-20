import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { Col,Media,Badge,Button,Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class OrgsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      orgs: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.orgs().on('value', snapshot => {
      const orgsObject = snapshot.val();

      const orgsList = Object.keys(orgsObject).map(key => ({
        ...orgsObject[key],
        uid: key,
      }));

      this.setState({
        orgs: orgsList,
        loading: false,
      });
    });
  }




  componentWillUnmount() {
    this.props.firebase.orgs().off();
  }
   
 
  render() {
    const { orgs, loading } = this.state;

    return (
      <div>
        <h1>Organizaciones</h1>

        {loading && <div>Loading ...</div>}
        <OrgSList orgs={orgs} />

      </div>
    );
  }
}



let imgStyle = {
  maxHeight: '128px',
  maxWidth: '128px'
}

const OrgSList = ({ orgs }) => (
  <ul>
    {orgs.map(org => (
      <li key={org.nombre}>

    <Media>
      <Media left >

        <Media object src={org.logo} style={imgStyle} alt="Generic placeholder image" />

      </Media>
      <Media body>
        <Media heading middle>
         &emsp;
         <Badge href={org.logo} color="primary">{org.nombre}</Badge>
        </Media>
          Descripcion de la organizacion        
         <Link to={"/organizations/encuestas/"+org.uid } > Ver informacion</Link>
        </Media>
    </Media>
       
        
      </li>
    ))}
  </ul>
);



export default withFirebase(OrgsPage);
