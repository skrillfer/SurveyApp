
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
    const { orgs, loading } = this.state;
    
    this.setState({ orgs:[],loading: true });
    this.firebaseRef = db.ref('proyectos/');
    
    let ARRAY = [];
    

    this.firebaseRef.on('value', snapshot => {
      snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          ARRAY.slice();
          db.ref('proyectos/'+childKey+'/encuestas').on('value', xsnapshot => {
            if(xsnapshot.exists())
            {

              const usersObject = xsnapshot.val();
              ARRAY=Object.keys(usersObject).map(key => ({
  
                ...usersObject[key],
                uid: key,
                organizacion: childData.nombre,
              }));
            }
              
          });
      });

      this.setState({
        loading:false,
        orgs: ARRAY,
      });
      
    });
    
  }


  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { orgs, loading } = this.state;
    console.log(orgs);
    console.log(orgs.length);

    return (
      <div>
        <h1>Informacion</h1>
        {loading && <div>Loading ...</div>}
        <OrgSList orgs={orgs} />
        
        
      </div>
     );
    
 
  }
}




const OrgSList = ({ orgs }) => (
  <table>
    <thead>
        <tr>
          <th>Organizacion</th>
          <th>Encuesta</th>     
        </tr>
    </thead>
    
    <tbody>
      {orgs.map(item => (
        
        <tr key={item.uid}>
            <td >
            {item.organizacion}
            </td>
            <td>
            {item.nombre}
            </td>
        </tr>
        
      ))}
    </tbody>

  </table>
);


const EncuestaSList = ({ encuestas }) => (
  <ul>
    {encuestas.map(item => (
      
      <li key={item.uid}>
          <div>
          {item.nombre}
          </div>
       </li>
      
    ))}
  </ul>
);



const domContainer = document.querySelector('#aplicacionReact');
ReactDOM.render(e(OrgsPage),domContainer);
