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
      respuestas : [],
      encabezados : [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    console.log(this.state.uid);
    console.log(this.state.uid_org);

    let index = 0;    
    let ARRAY = [];

    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      xsnapshot.forEach(function(childSnapshot) {

          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          
          

          /*var lista = childSnapshot.child('body').val();
          console.log(lista);
          ARRAY=Object.keys(lista).map(key => ({
            ...lista[key],
            uid: key,
          }));*/
          
          let lista = [];
          ARRAY.push({'lista':lista,'key':index});
          index++;

          let index2=index;
          childSnapshot.child('body').forEach(function(inSnapshot) {
            
            if(inSnapshot.exists())
            {

              var childKey1 = inSnapshot.key;
              var childData1 = inSnapshot.val();

              lista.push({'pregunta':childKey1,'respuesta':childData1,'key':index2});
              index2++;
            }
          });

      });
        
    });
     
   

    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/encuestas/'+this.state.uid).on('value', xsnapshot => {
      var childKey = xsnapshot.key;
      var childData = xsnapshot.val();
      //console.log(childData);

      this.setState({
        loading:false,
        nombre: childData.nombre,
        respuestas: ARRAY,
        encabezados:ARRAY[0].lista,
      });

    });
    
  }




  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { uid_org, nombre,encabezados,respuestas,loading } = this.state;
    console.log(respuestas);
    console.log(encabezados);
    return (

      <div>
        <h2> {nombre}</h2>
        {loading && <div>Loading ...</div>}
        <ListaRespuestas resp={respuestas} enca={encabezados} />
       

      </div>
    );
  }
}

const ListaRespuestas = ({ resp,enca }) => (
  
  <table id="customers">
    <thead>
        <tr>
          {enca.map( item =>(
            <th >
                {item.pregunta}
            </th>
          ))}
        </tr>
    </thead>
    
    <tbody>
        {resp.map( lt =>(
          <tr key = {lt.key}>
          {lt.lista.map( item =>(
              <td key = {item.key}>
                {item.respuesta}   
              </td>
          ))}
          </tr>
        ))}
      
    </tbody>

  </table>
);


const domContainer = document.querySelector('#container');
ReactDOM.render(e(EncuestasPage),domContainer);