

class EncuestasPage extends React.Component {
  _isMounted = false;
  _isPicker  = false;
  constructor(props) {
    super(props);
    this.filtrar_respuestas = this.filtrar_respuestas.bind(this);
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);

    this.cerrarGrafica =  this.cerrarGrafica.bind(this);
    this.cerrarTodo    =  this.cerrarTodo.bind(this);

          /*        Funciones de PopUp Menu       */
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
      showComponent: 1,
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
      
      //mapas
      queryMap : {},
      count    : 0,
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
    let LMap  = {};
    let Tcount = 0;
    console.log('comenzamos');
    let current = this;
    this.F1=db.ref('proyectos/'+this.state.uid_org+'/respuestas/'+this.state.uid).on('value', xsnapshot => {
      Tcount=xsnapshot.numChildren();
      xsnapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          
          if(control)
          {
            ARRAY = [];
            current.state.queryHash = {};
            control=false;
             /*- mapa -*/
             LMap = {};
             /*- mapa -*/
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

          /*- mapa -*/

          let latitude="";
          let longitude="";
          let date="";
          if (childSnapshot.hasChild("latitude") && childSnapshot.hasChild("longitude") && childSnapshot.hasChild("date"))
          {
            
            latitude  = childSnapshot.child("latitude").val();
            longitude = childSnapshot.child("longitude").val();
            date      = childSnapshot.child("date").val();

            if(!LMap[childKey] && (latitude!=0 && longitude!=0)){
              LMap[childKey] = [];
              LMap[childKey].push({'latitude':latitude,'longitude':longitude,'date':date});
            }
          }
          /*- mapa -*/
          
         
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
            queryMap : LMap,
            count : Tcount,
          },s=>{
                   
                  control=true;
                  

                  /*Agregando los tipos de columnas para seleccionar del dropdown */
                  var mydiv = document.getElementById("menuDropEncuesta");
                  mydiv.innerHTML ="";
                  this.state.headers.map(item =>
                    {
                      var li_element = document.createElement('li');
                      var a_element = document.createElement('a');
                      a_element.title = item;
                      var linkText = document.createTextNode(item);
                      a_element.appendChild(linkText);
                      a_element.className = "dropdown-item";
                      a_element.onclick = this.accionDropDown;
                      li_element.appendChild(a_element);
                      mydiv.appendChild(a_element);
                      
                    }
                  );

                  var mybtnSave = document.getElementById("btn_DropdownSave");
                  mybtnSave.onclick = this.agregarDropDown;

                  var li_manager = document.getElementById("li_manager");
                  
                  if(li_manager.childNodes.length==3)
                  {
                    /*------------------------ Data (Tabla) ---------------------*/
                    var a_data = document.createElement("a");
                    a_data.setAttribute("class", "nav-link");

                    var i_data = document.createElement("i");
                    i_data.setAttribute("class", "nav-icon icon-note");

                    a_data.appendChild(i_data);
                    a_data.appendChild(document.createTextNode("Data"));
                    a_data.onclick = onClick =>{ 
                        this.setState({showComponent:2}); 
                    };

                    li_manager.appendChild(a_data);

                    /*------------------------ Data (Tabla)---------------------*/
                    
                    /*------------------------ General (Mapa) ---------------------*/
                    var a_res = document.createElement("a");
                    a_res.setAttribute("class", "nav-link");

                    var i_res = document.createElement("i");
                    i_res.setAttribute("class", "nav-icon icon-map");

                    a_res.appendChild(i_res);
                    a_res.appendChild(document.createTextNode("Resumen"));
                    a_res.onclick = onClick =>{ 
                            this.setState({showComponent:1});
                          };

                    li_manager.appendChild(a_res);
                    /*------------------------ General (Mapa) ---------------------*/
                    
                  }
                  

               }
          );
        }
      });

    });
     
   
    
    
  }


  componentDidUpdate()
  {

    if(this.state.showComponent==2)
    {
      try{
        $(document).ready( function () {
            $('#example11').DataTable();
         
        });

        
        if(!this._isPicker)
        {
          var datepicker = new ej.calendars.DatePicker({ width: "155px", placeholder: 'Fecha Inicial' });
          datepicker.appendTo('#datepickerIni');
          var datepicker = new ej.calendars.DatePicker({ width: "155px", placeholder: 'Fecha Final' });
          datepicker.appendTo('#datepickerFin');  
          this._isPicker = true;  
        }
        
      }catch(exx){} 
    }else if(this.state.showComponent==1)
    {
      this._isPicker=false;
    }
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

    var QueryHASH = {};
    this.state.headers.map( (value,i) =>{QueryHASH[value]=[];});

    var updatedList = this.state.data.slice();

    const filtrada = [];
    updatedList.map((item) => 
      {
        const v = item.filter(subitem => 
            subitem.respuesta.toString().toLowerCase().search(
                event.toString().toLowerCase()) !== -1
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
    
    var RETORNO = [];
    RETORNO.push({listafiltrada: filtrada,HashFilter:QueryHASH});
    return RETORNO;

  }

      

  convertArrayOfObjectsToCSV(arr, columnCount, initial) {
    var row = ''; // this will hold data
    var delimeter = ','; // data slice separator, in excel it's `;`, in usual CSv it's `,`
    var newLine = '\r\n'; // newline separator for CSV row

    
    function splitArray(_arr, _count) {
      var splitted = [];
      var result = [];
      _arr.forEach(function(item, idx) {
        if ((idx + 1) % _count === 0) {
          splitted.push(item);
          result.push(splitted);
          splitted = [];
        } else {
          splitted.push(item);
        }
      });
      return result;
    }
    var plainArr = splitArray(arr, columnCount);
    
    plainArr.forEach(function(arrItem) {
      arrItem.forEach(function(item, idx) {
        row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
      });
      row += newLine;
    });
    return initial + row;
  }



  downloadCSV(args) {

    var titles = [];
    var data = [];
  
    $('.dataTable th').each(function() {
      titles.push($(this).text());
    });
  
  
    $('.dataTable td').each(function() {
      data.push($(this).text());
    });
 
    var CSVString = this.convertArrayOfObjectsToCSV(titles, titles.length, '');
    CSVString = this.convertArrayOfObjectsToCSV(data, titles.length, CSVString);
  
    
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", CSVString]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";
  
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    
  }

  
  
  render() {
    const { nombre,showGraphic,showComponent,loading,pregunta,gridList,queryHash,gridListHead } = this.state;
    console.log("RENDERIZADO");    
    return (

      <div>
        
        <div id="graphic" className="graphicss">
            
            {showGraphic ? 
               
               <GridGraphs 
                   cerrarGrafica = {this.cerrarGrafica} 
                   cerrarTodo = {this.cerrarTodo} 
                   gridList = {gridList} 
                   pregunta = {pregunta} 
                   respuestas = {queryHash}  
                   children   = {gridList}
                   gridListHead = {gridListHead}
               />
               : null
             } 
        </div>

      {
      showComponent==1?
        <Resumen queryMap ={this.state.queryMap} count = {this.state.count}/>
      :showComponent==2?
        
        <div className="card">
             <div className="card-header">
                
                
                  {!loading ?
                    <div className="form-horizontal">

                      <div className="form-group row">
                          <div className="col-md-4">
                            {nombre}          
                          </div>
                          <div className="col-md-4">
                                <button href="#" onClick={this.downloadCSV} className="btn btn-block btn-link"><i className="icon-arrow-down-circle btnDescargaCSV"></i>Descargar CSV</button>
                          </div>

                          <div className="col-md-8"><input type="text" id="datepickerIni"/>
                          </div>
                          <div className="col-md-4"><input type="text" id="datepickerFin"/>
                          </div>

                      </div>
                      
                      <div className="form-group row">
                          
                          
                      </div>    
                      
                    </div> : null
                  }
                  

                </div>
            <div className="card-body" id="TablaRespuestas">
            <ListaRespuestas headers={this.state.headers} matrix={this.state.listafiltrada}  renderizarColumna ={this.renderizarColumna}/>
            
            </div>
            <div id="contenedorFunciones">
              {loading && <div style ={{display: 'block'}}  className="text-center">
                              <div className="spinner-border" role="status">
                                  <span className="sr-only">Loading...</span>
                              </div>
                          </div>}
            </div>
        
          
        </div>
      :null}
        
      </div>
    );
      
    
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

  cerrarTodo()
  {
    this.setState({gridList:[],gridListHead:[],showGraphic:false},()=>{
      
    });
  }
  cerrarGrafica(index)
  {
    
    if(this._isMounted)
    {

      try{

        let gridList1 = this.state.gridList.filter((_,item) => item !== parseInt(index));
        let gridListHead1 = this.state.gridListHead.filter((_,item) => item !== parseInt(index));
        if(gridList1.length==0)
        {
          
          gridList1 = [];gridListHead1 = [];
        }
        
        var current = this;
        this.setState({gridList:gridList1,gridListHead:gridListHead1},()=>{
          
          if(!gridList1.length>0){
            current.setState({showGraphic:false});
          }else
          {
            document.getElementById("Gridloader").style.display = "none";
            document.getElementById("ui-view").style.display = "block";
          }
          
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

      try{
        var FILTER = document.getElementById("example11_filter");
        var inputNodes = FILTER.getElementsByTagName('INPUT');
        this.setState({textSearch:inputNodes[0].value});
        /* 
        OPCIONES:
        1. Enviar el textSearch y enviar la funcion filtrar para obtener una data filtrada
        2. refactorizar codigo y entonces tendria que tener una palabra search para que cada
        grafica sea generada de acuerdo a su search
        */

      }catch(exx){}
      
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



}

const ListaRespuestas = ({ headers,matrix ,renderizarColumna }) => (
  
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