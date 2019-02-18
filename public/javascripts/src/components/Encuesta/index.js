

class EncuestasPage extends React.Component {
  _isMounted = false;
  LISTA    = [];
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
    this.obtenerEncabezado = this.obtenerEncabezado.bind(this);

    this.accionDropDown = this.accionDropDown.bind(this);
    this.agregarDropDown = this.agregarDropDown.bind(this);
    this.prueba = this.prueba.bind(this);


    this.state = {
      loading: false,
      uid: id,
      uid_org: org,
      nombre : '',
      listafiltrada : [],
      showPopup: false,
      pregunta: '',
      respuesta: '',

      //refactor
      headers : [],
      data : [],
      queryHash: {},
      posicion : '',
      HashFilter: {},
      showGraphic :false,
      textSearch : '',
      gridList : [],
      gridListHead : [],
      
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
    
    this._isMounted = true;

    var control = false;

    this.setState({ loading: true });

    console.log(this.state.uid);
    console.log(this.state.uid_org);

    let ARRAY = [];

    console.log('comenzamos');
    let current = this;
    this.F1=db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      xsnapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          
          if(control)
          {
            ARRAY = [];
            current.state.queryHash = {};
            control=false;
          }
          

          let lista = [];
          ARRAY.push(lista);
          
          db.ref('proyectos/'+current.state.uid_org+'/respuestas/'+current.state.uid+'/'+childKey+'/body').on('value', 
              bodyxnapshot=>{
                bodyxnapshot.forEach(function(inSnapshot) {
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
              }
          );
         
      });

      this.F2=db.ref('proyectos/'+this.state.uid_org+'/encuestas/'+this.state.uid).on('value', xsnapshot => {
        var childKey = xsnapshot.key;
        var childData = xsnapshot.val();
        if (this._isMounted) {
          this.setState({
            loading:false,
            nombre: childData.nombre,
            data : ARRAY,
            listafiltrada: ARRAY,
          },s=>{
                   
                  control=true;
                  

                  /*Agregando los tipos de columnas para seleccionar del dropdown */
                  var mydiv = document.getElementById("menuDropEncuesta");
                  mydiv.innerHTML ="";
                  this.state.headers.map(item =>
                    {
                      var a_element = document.createElement('a');
                      a_element.title = item;
                      var linkText = document.createTextNode(item);
                      a_element.appendChild(linkText);
                      a_element.className = "dropdown-item";
                      a_element.onclick = this.accionDropDown;
                      mydiv.appendChild(a_element);
                      
                    }
                  );

                  var mybtnSave = document.getElementById("btn_DropdownSave");
                  mybtnSave.onclick = this.agregarDropDown;

                  /*-------------------------------------------------------------- */
                  try{
                    $(document).ready( function () {
                      $('#example11').DataTable();
                  } );
                  }catch(exx){}

                  

               }
          );
        }
      });

    });
     
   
    
    
  }

  componentWillUnmount()
  {
    this._isMounted = false;
  }

  obtenerEncabezado(index)
  {
    var encabezado= '';
    this.state.headers.map( (head,i) =>
      {
        if(i==index)
        {
          encabezado = head;
          return;
        }
      }
    );
    return encabezado;
  }

  filtrar_respuestas(event)
  {   
    
    this.setState({textSearch:event.target.value});


    var QueryHASH = {};
    this.state.headers.map( (value,i) =>{QueryHASH[value]=[];});

    var updatedList = this.state.data.slice();

    const filtrada = [];
    updatedList.map((item) => 
      {
        const v = item.filter(subitem => 
            subitem.respuesta.toString().toLowerCase().search(
                event.target.value.toLowerCase()) !== -1
        );

        if(v.length>0)
        {

          item.map(
            element =>
            {
              var keyHash=this.obtenerEncabezado(element.index);
              QueryHASH[keyHash].push(element.respuesta);
            }
          );

          filtrada.push(item);
        }
        
      }     
    );
    if(this._isMounted)
    {
      
      this.setState({listafiltrada: filtrada,HashFilter:QueryHASH});
    }
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

  
  
  render() {
    const { nombre,showGraphic,loading,pregunta,gridList,queryHash,gridListHead } = this.state;
    console.log("RENDERIZADO");

    let button = null;
    
    return (

      <div>
        
        <div id="graphic" className="graphicss">
            
            {showGraphic ? 
               
               <GridGraphs 
                   cerrarGrafica = {this.cerrarGrafica} 
                   gridList = {gridList} 
                   pregunta = {pregunta} 
                   respuestas = {queryHash}  
                   children   = {gridList}
                   gridListHead = {gridListHead}
               />
               : null
             } 
        </div>
       
        
        <div id="contenedorFunciones">
            <center><h1> {nombre} </h1></center>
            <button onClick={this.downloadCSV} className="btn btn-block btn-link"> Descargar CSV</button>
            {loading && <div>Loading ...</div>}
            
            <div>
            </div>
        </div>
        {this.state.showPopup ? 
          (
            this.cerrarGrafica,
          <ListBox
            text={'Estadisticas Graficas de '+this.state.pregunta+'?'}
            closePopup={this.togglePopup.bind(this)}
            clickGenerarGrafico = {this.clickGenerarGrafico}
            clickGraficaPie = {this.clickGraficaPie}
            posicion = {this.state.posicion}
          ></ListBox>
           
          )
          : null
        }
        <div id="TablaRespuestas">
          <ListaRespuestas headers={this.state.headers} matrix={this.state.listafiltrada} handle = {this.togglePopup} lt ={[]} renderizarColumna ={this.renderizarColumna}/>
          
        </div>

        
      </div>
    );
      
    
  }


 

  /*Funciones de PopUp Menu */
  clickGenerarGrafico(event)
  {
    /*
    if (this.state.gridList.length==0) return "";

    this.setState({showGraphic:true});

    var HashFilter = this.state.HashFilter;
    if(Object.keys(this.state.HashFilter).length==0)
    {
      HashFilter = this.state.queryHash;
    }

    var list = document.getElementById("graphic");
    if(list.childNodes.length>0)
    {
      list.removeChild(list.childNodes[0]);
    }    
    this.setState({showPopup: !this.state.showPopup,});
    const { pregunta, headers} = this.state;
    
   
    return (ReactDOM.render( <GridGraphs cerrarGrafica = {this.cerrarGrafica} tipo= {event.target.id} pregunta = {pregunta} encabezados = {headers} respuestas = {HashFilter}/>, document.getElementById('graphic')));*/

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

  prueba()
  {
    console.log("TERMINE");
  }

  cerrarGrafica(index)
  {
    
    if(this._isMounted)
    {
      //var index = event.target.id;
      try{

        
        let gridList1 = this.state.gridList.filter(item => item !== parseInt(index));
  
        let gridListHead1 = this.state.gridListHead.filter(item => item !== parseInt(index));
        var doc=document;
        //var micarta = doc.getElementById("card_"+index);
        this.setState({gridList:gridList1,gridListHead:gridListHead1},()=>{
          
          //micarta.parentNode.removeChild(micarta);
        });
      
        
      }catch(exx){
        console.log(exx);
      }
  
    }
    
  }


  /*------- Opciones de agregar grafica   */
  accionDropDown(event){
    if (this._isMounted){
      document.getElementById("validationSelectedColum").value =event.target.title;
    }
  }
 
  

  agregarDropDown()
  {
    if (this._isMounted && document.getElementById("validationSelectedColum").value!='') {

      var mypregunta = document.getElementById("validationSelectedColum").value;
      var siCheck =false;
      if(document.getElementById("checkHistogram").checked)
      {
        siCheck =true;
        this.setState({gridList:this.state.gridList.concat(0),pregunta:mypregunta
                      ,gridListHead:this.state.gridListHead.concat(mypregunta)});
      }
      if(document.getElementById("checkPie").checked)
      {
        siCheck =true;
        this.setState({gridList:this.state.gridList.concat(1),pregunta:mypregunta
                      ,gridListHead:this.state.gridListHead.concat(mypregunta)});
      }
      
      if(siCheck)
      {        
        this.setState({showGraphic:false});
        console.log(this.state.gridList);
        console.log(this.state.gridListHead);
        $('#exampleModal').modal('hide');
        this.setState({showGraphic:true});
      }else
      {
        alert('Tienes que elegir al menos un tipo de grafica');

      } 
    }else
    {
      alert('Debes seleccionar al menos una Columna');

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
  
  <table id="example11" className="table table-striped table-bordered">
    <thead>
        <tr>
          {headers.map( item =>(
            <th name = {item} id = {item}  key = {item}>
                {item}
            </th>
          ))}
        </tr>
    </thead>
    
    <tbody>
        {
          matrix.map((row,x) => (
            <tr key ={x}>
            {
                  
                  headers.map((value,i) => (
                    <td  key ={value+'_'+i}>
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