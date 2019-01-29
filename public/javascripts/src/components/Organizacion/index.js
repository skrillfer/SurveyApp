'use strict';

const e = React.createElement;

class OrgsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orgs: [],
      userKey: UserID,
    };
  }

  componentDidMount() {
    const { orgs, loading } = this.state;
    console.log('KEY:'+this.state.userKey);
    this.setState({ orgs:[],loading: true });

    this.firebaseRef = db.ref('proyectos/');
    
    var current = this;
    db.ref('usuarios/'+this.state.userKey+'/organizaciones').on('value', snapshot => {
        current.setState({ 
          orgs: []
        });
        snapshot.forEach(function(childSnapshot) {
          var orgKey = childSnapshot.key;
          

          db.ref('proyectos/'+orgKey).on('value',childSnapshot =>{

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();


            if(childSnapshot.hasChild('encuestas'))
            {
                db.ref('proyectos/'+childKey+'/encuestas').on('value', xsnapshot => {
                  if(xsnapshot.exists())
                  {
                    const usersObject = xsnapshot.val();

                    let ARRAY2=Object.keys(usersObject).map(key => ({
                      ...usersObject[key],
                      uid: key,
                      organizacion: childData.nombre,
                      idorg: childKey,
                    }));

                    current.setState({ 
                      orgs: current.state.orgs.concat([ARRAY2.slice()])
                    })
                  }
                    
                });
            }
          });
          
        });
        
    }
    
    );

    this.setState({
      loading:false,
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
  <table id="customers">
    <thead>
        <tr>
          <th>Organizacion</th>
          <th>Encuesta</th>     
        </tr>
    </thead>
    
    <tbody>
      {orgs.map(data => data.map( item =>
        
        <tr key={item.uid}>
            <td >
            {item.organizacion}
            </td>
            <td>
            <a href={'/dashboard/encuesta/'+item.idorg+'/'+item.uid} >{item.nombre}</a>
            </td>
        </tr>
        
      ))}
    </tbody>

  </table>
);


const domContainer = document.querySelector('#container');
ReactDOM.render(e(OrgsPage),domContainer);

