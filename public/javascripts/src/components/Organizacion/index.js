'use strict';

const e = React.createElement;

class OrgsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orgs: [],
      headers : [],
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
        current.setState({ 
          orgs: current.state.orgs[current.state.userKey]=([])
        })
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

                    const ARRAY2=Object.keys(usersObject).map(key => ({
                      ...usersObject[key],
                      uid: key,
                      organizacion: childData.nombre,
                      idorg: childKey,
                    }));
                    var HashTmp = current.state.orgs;
                    HashTmp[childKey] = ARRAY2;
                    current.setState({ 
                      orgs: HashTmp
                    })
                  }
                    
                });
            }
          });
          
        });
    }
    
    );

    

  }



  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { orgs, loading } = this.state;
    console.log('----------------');
    console.log(orgs);
    //console.log(Object.keys(orgs));


    return (
      <div>
        <h1>Informacion</h1>
        <OrgSList orgs={orgs} />  
      </div>
     );
    
 
  }
}


//        <OrgSList orgs={orgs} />        



const OrgSList = ({ orgs }) => (
  <table id="customers">
    <thead>
        <tr>
          <th>Organizacion</th>
          <th>Encuesta</th>     
        </tr>
    </thead>
    
    <tbody>
      {Object.keys(orgs).map( key => ( 
        
        
            
              orgs[key].map(
                  item =>
                  ( <tr key={key+item.uid}>
                      <td ket = {key+item.uid}>
                      {item.organizacion}
                      </td>
                      <td>
                        <a href={'/dashboard/encuesta/'+key+'/'+item.uid} >{item.nombre}</a>
                      </td>
                    </tr>

                  )
              ) 

            
        
      ))}
    </tbody>

  </table>
);


const domContainer = document.querySelector('#container');
ReactDOM.render(e(OrgsPage),domContainer);

