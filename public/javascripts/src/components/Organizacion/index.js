
'use strict';

const e = React.createElement;

class OrgsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      orgs: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
  
    this.firebaseRef = FIREBASE_ORGS();
    this.firebaseRef.on('value', snapshot => {
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
    this.firebaseRef.off();
  }
   
 
  render() {
    const { orgs, loading } = this.state;
    return (
      <div>
        Organizaciones
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
       <li key={org.uid}>
          <div>
          {org.nombre}
          </div>
       </li>
      
    ))}
  </ul>
);


const domContainer = document.querySelector('#aplicacionReact');
ReactDOM.render(e(OrgsPage),domContainer);
