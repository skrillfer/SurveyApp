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
          //console.log(childKey);

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

                  ARRAY.push(ARRAY2.slice());
                }
                  
              });
          }
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

