'use strict';

const e = React.createElement;

class EncuestasPage extends React.Component {
  constructor(props) {
    super(props);
    this.filtrar_respuestas = this.filtrar_respuestas.bind(this);

    this.state = {
      loading: false,
      uid: id,
      uid_org: org,
      nombre : '',
      respuestas : [],
      encabezados : [],
      listafiltrada : [],
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
        listafiltrada: ARRAY,
      });

    });
    
  }


  filtrar_respuestas(event)
  {


   
    var updatedList = this.state.respuestas.slice();
    
    
    //console.log(event.target.value.toLowerCase());
    const filter = 'Brayan';
    /*const filteredResult = updatedList.filter((item) => {
        item.lista.some((respuesta))
    });*/

    const filtrada = [];
    updatedList.map((item) => 
      {
        const v = item.lista.filter(subitem => 
          subitem.respuesta.toString().toLowerCase().search(
            event.target.value.toLowerCase()) !== -1);
          //subitem.respuesta.toString().toLowerCase() === event.target.value.toLowerCase());
        if(v.length>0)
        {
          filtrada.push({'lista':item.lista,'key':item.key});
        }
        
      }     
    );
    this.setState({listafiltrada: filtrada});
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { uid_org, nombre,listafiltrada,encabezados,respuestas,loading } = this.state;
    //console.log(respuestas);
    //console.log(encabezados);
    return (

      <div>
        <form>
          <fieldset className="form-group">
          <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filtrar_respuestas}/>
          </fieldset>
        </form>
        <h2> {nombre}</h2>
        {loading && <div>Loading ...</div>}
        <ListaRespuestas resp={listafiltrada} enca={encabezados} />
       

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