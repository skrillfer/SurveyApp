

class EncuestasPage extends React.Component {
  constructor(props) {
    super(props);
    this.filtrar_respuestas = this.filtrar_respuestas.bind(this);
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);

    this.cerrarGrafica = this.cerrarGrafica.bind(this);

          /*        Funciones de PopUp Menu       */
    this.clickGenerarGrafico =  this.clickGenerarGrafico.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.generateHead = this.generateHead.bind(this);
    this.renderizarColumna = this.renderizarColumna.bind(this);


    this.state = {
      loading: false,
      uid: id,
      uid_org: org,
      nombre : '',
      respuestas : [],
      encabezados : [],
      listafiltrada : [],
      showPopup: false,
      pregunta: '',
      respuesta: '',

      //refactor
      headers : [],
      data : [],
      queryHash: {},
      posicion : '',
    };
  }


  generateHead(head){
    if(this.state.headers.includes(head)){
        return this.state.headers.indexOf(head);
    }else{
        return this.state.headers.push(head)-1;
    }
  }

  

  componentDidMount() {
    this.setState({ loading: true,respuestas:[] });

    console.log(this.state.uid);
    console.log(this.state.uid_org);

    let ARRAY = [];


    let current = this;
    this.firebaseRef = db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      xsnapshot.forEach(function(childSnapshot) {

          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          let lista = [];
          ARRAY.push(lista);

          childSnapshot.child('body').forEach(function(inSnapshot) {
            
            if(inSnapshot.exists())
            {

              var childKey1 = inSnapshot.key;
              var childData1 = inSnapshot.val();
              lista.push({'index':current.generateHead(childKey1),'respuesta':childData1});
              if(current.state.queryHash[childKey1]){
                current.state.queryHash[childKey1].push(childData1);
              }else{
                current.state.queryHash[childKey1] = [childData1];
              }
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
        data : ARRAY,
        encabezados:ARRAY[0].lista,
        listafiltrada: ARRAY,
      });

    });
    
  }


  filtrar_respuestas(event)
  {   
    var updatedList = this.state.data.slice();

    const filtrada = [];
    updatedList.map((item) => 
      {
        const v = item.filter(subitem => 
            subitem.respuesta.toString().toLowerCase().search(
                event.target.value.toLowerCase()) !== -1
        );

        console.log();
        if(v.length>0)
        {
          filtrada.push(item);
        }
        
      }     
    );
    this.setState({listafiltrada: filtrada});
  }

  convertArrayOfObjectsToCSV(args) {
    var result, headers, lineDelimiter,columnDelimiter, data;

    headers = args.headers || null;
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
   
    result = '';
    var ct = 0;
    headers.map(item => 
    {
      if(ct>0) result += columnDelimiter;
      ct++;
      result += item;
    });
    result += lineDelimiter;

    data.map(
      row => {
      
          ct = 0;
  
          headers.map(
            (value,i) => {
              if(ct>0) result += columnDelimiter
              ct++;
              result += this.renderizarColumna(row,i);
            }
          )
          result += lineDelimiter;

      }
    );
    return result;
  }



  downloadCSV(args) {
    var data, filename, link;
    var csv = this.convertArrayOfObjectsToCSV({
        data: this.state.data,
        headers: this.state.headers
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
    const { nombre,listafiltrada,loading } = this.state;
    //console.log(respuestas);
    //console.log(encabezados);
    return (

      <div>
        
        <div id="Search">
            <form>
              <fieldset className="form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filtrar_respuestas}/>
              </fieldset>
            </form>
        </div>
        <div id="contenedorFunciones">
            <h2> {nombre}</h2>
            {loading && <div>Loading ...</div>}
            <button onClick={this.downloadCSV}>Descargar csv</button>
            <div>
            </div>
        </div>
        <div id="graphic" className="graphicss"></div>
        <div id="TablaRespuestas">
          <ListaRespuestas headers={this.state.headers} matrix={this.state.listafiltrada} handle = {this.togglePopup} lt ={[]} renderizarColumna ={this.renderizarColumna}/>
        </div>

        {this.state.showPopup ? 
          <ListBox
            text='Que Tipo de Grafica?'
            closePopup={this.togglePopup.bind(this)}
            clickGenerarGrafico = {this.clickGenerarGrafico}
            clickGraficaPie = {this.clickGraficaPie}
            posicion = {this.state.posicion}
          />
          : null
        }
        
      </div>
    );
    
  }


 

  /*Funciones de PopUp Menu */
  clickGenerarGrafico(event)
  {
    
    var list = document.getElementById("graphic");
    if(list.childNodes.length>0)
    {
      list.removeChild(list.childNodes[0]);
    }    
    this.setState({showPopup: !this.state.showPopup,});
    const {  encabezados ,respuestas,pregunta, headers, queryHash} = this.state;
    
   
    return (ReactDOM.render( <Grafica cerrarGrafica = {this.cerrarGrafica} tipo= {event.target.id} pregunta = {pregunta} encabezados = {headers} respuestas = {queryHash}/>, document.getElementById('graphic')));
  }



  renderizarColumna(row,i)
  {

    var tempElement = row.find(function(element) {
      return element.index == i;
    });

    
    if(tempElement)
    {
      
      return tempElement.respuesta;
    }
    else
    {
      return "";
    }

    
  }

  cerrarGrafica()
  {
    var list = document.getElementById("graphic");
    if(list.childNodes.length>0)
    {
      list.removeChild(list.childNodes[0]);
    }    
  }

  togglePopup(event) {
    var posicionM = '';
    try{
      var elemento = document.getElementById(event.target.id);
      posicionM = elemento.getBoundingClientRect();
    }catch(ex){}
    

    this.setState({
      showPopup: !this.state.showPopup,
      pregunta:   event.target.getAttribute('name'),
      respuesta : event.target.id,
      posicion :  posicionM,
    });
  }

}

const ListaRespuestas = ({ headers,matrix , handle,lt,renderizarColumna }) => (
  
  <table id="customers">
    <thead>
        <tr>
          {headers.map( item =>(
            <th name = {item} id = {item} onClick = {handle} >
                {item}
            </th>
          ))}
        </tr>
    </thead>
    
    <tbody>
        {
          matrix.map(row => (
            <tr>
            {
                  
                  headers.map((value,i) => (
                    <td  >
                       {renderizarColumna(row,i)}
                    </td>
                  )
                  )
            }
            </tr>
            )
          )
          
        }
      
    </tbody>

  </table>
);






ReactDOM.render(<EncuestasPage/>, document.getElementById('container'));  

/**/