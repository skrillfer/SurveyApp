import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { Col,Media,Badge,Button,Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class EncuestasPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      org: props.match.params.org,
      objeto:[],  
      encuestas : [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
           console.log(this.state.org);
    this.props.firebase.o_rg(this.state.org).on('value', snapshot => {

      const org_object = snapshot.val();
       console.log(org_object);

      const encuestasObject=org_object.encuestas;
      const ListaEncuestas = Object.keys(encuestasObject).map(key => ({

        ...encuestasObject[key],
        uid: key,
      }));

        this.setState({
            loading: false,
            org: this.state.org,
            objeto:org_object, 
            encuestas : ListaEncuestas,
        });
    });
  }




  componentWillUnmount() {
    this.props.firebase.o_rg().off();
  }
   
 
  render() {
    const { org, loading,objeto,encuestas } = this.state;

    return (

      <div>
        <h1>Encuestas de {objeto.nombre}</h1>

        <EncuMap encuestas={encuestas} />

      </div>
    );
  }
}



const EncuMap = ({ encuestas }) => (
  <ul>
    {encuestas.map(user => (
      <li key={user.uid}>
          <strong>Nombre:</strong> {user.uid}
        
        
      </li>
    ))}
  </ul>
);

export default withFirebase(EncuestasPage);
