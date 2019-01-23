'use strict';

const e = React.createElement;

class EncuestasPage extends React.Component {
  constructor(props) {
    super(props);
    this.filtrar_respuestas = this.filtrar_respuestas.bind(this);
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);

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
    this.setState({ loading: true,respuestas:[] });

    console.log(this.state.uid);
    console.log(this.state.uid_org);

    let index = 0;    
    let ARRAY = [];

    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      xsnapshot.forEach(function(childSnapshot) {

          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

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

    const filtrada = [];
    updatedList.map((item) => 
      {
        const v = item.lista.filter(subitem => 
            subitem.respuesta.toString().toLowerCase().search(
                event.target.value.toLowerCase()) !== -1
        );
        if(v.length>0)
        {
          filtrada.push({'lista':item.lista,'key':item.key});
        }
        
      }     
    );
    this.setState({listafiltrada: filtrada});
  }

  convertArrayOfObjectsToCSV(args) {
    var result, heads, lineDelimiter,columnDelimiter, data;

    heads = args.enca || null;
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    result = '';
    var ct = 0;
    heads.map(item => 
    {
      if(ct>0) result += columnDelimiter;
      ct++;
      result += item.pregunta;
    });
    result += lineDelimiter;

    {data.map( lt => 
      {
        ct = 0;
        lt.lista.map( item =>{
          if(ct>0) result += columnDelimiter;
          ct++;
          result += item.respuesta;
        })
        result += lineDelimiter;
      })
    };

    return result;
  }

  downloadCSV(args) {
    var data, filename, link;
    var csv = this.convertArrayOfObjectsToCSV({
        data: this.state.respuestas,
        enca: this.state.encabezados
    });
    if (csv == null) return;

    filename = args.filename || this.state.nombre+'_export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
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
        <button onClick={this.downloadCSV}>Descargar csv</button>;
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