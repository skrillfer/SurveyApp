'use strict';

const e = React.createElement;

class EncuestasPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      uid: id,
      uid_org: org,
      nombre : '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    console.log(this.state.uid);
    console.log(this.state.uid_org);

    
    

    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      xsnapshot.forEach(function(childSnapshot) {

          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          console.log(childKey);
          /*if(xsnapshot.exists())
          {

            const usersObject = xsnapshot.val();
            
            ARRAY=Object.keys(usersObject).map(key => ({

              ...usersObject[key],
              uid: key,
              organizacion: childData.nombre,
              idorg: childKey,
            }));
            
        }*/
      });
        
    });
     
    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/encuestas/'+this.state.uid).on('value', xsnapshot => {
      var childKey = xsnapshot.key;
      var childData = xsnapshot.val();
      console.log(childData);

      this.setState({
        loading:false,
        nombre: childData.nombre,
      });

    });
    
  }




  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { uid_org, nombre,loading } = this.state;

    return (

      <div>
        <h1> {nombre}</h1>

        
      </div>
    );
  }
}

const domContainer = document.querySelector('#container');
ReactDOM.render(e(EncuestasPage),domContainer);