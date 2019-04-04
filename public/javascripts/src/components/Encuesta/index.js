

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

    //--------------------Segmentar Fecha
    this.segmentar = this.segmentar.bind(this);
    this.segmentarTodo = this.segmentarTodo.bind(this);

    //--------------------Mostrar Imagen de Storage
    this.cargarImagenStorage = this.cargarImagenStorage.bind(this);

    //--------------------Set TipoCambio
    this.setTipoCambio = this.setTipoCambio.bind(this);

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
      showGraphic :true,
      textSearch : '',

      //Manejo de Graficas Add/Remove
      gridAction : null,
      gridTipoCambio : 0,
      
      //mapas
      queryMap : {},
      count    : 0,
  
      //Dates
      queryDate : {},
      referenceData:[],
      reloadGraph : false,
    };
  }

  setTipoCambio(val)
  {
    this.state.gridTipoCambio = val;
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

    //console.log(this.state.uid);
    //console.log(this.state.uid_org);

    let ARRAY = [];
    let LMap  = {};
    let VQ  = {};
    //let LDate  = {};

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
            /*
              La variable control me permite controlar los update que se dan en la base de datos 
            */
            current.state.gridTipoCambio=1;
            ARRAY = [];
            current.state.queryHash = {};
            console.log("JODE");
            control=false;
             /*- mapa -*/
             LMap = {};
             /*- mapa -*/

             VQ = {};

             /*- Segmentacion -*/
             current.state.queryDate = {};
             /*- Segmentacion -*/
          }
          

          let lista = []; // Cada lista es una respuesta
          ARRAY.push(lista);
  
          /*- carga de respuestas -*/
          db.ref('proyectos/'+current.state.uid_org+'/respuestas/'+current.state.uid+'/'+childKey+'/body').on('value', 
              bodyxnapshot=>{
                if(lista.length>0)
                {
                  lista=[];
                }
                bodyxnapshot.forEach(function(inSnapshot) {
                    if(inSnapshot.exists())
                    {
                      //console.log(inSnapshot.key);

                      //console.log();
                      var childKey1;
                      var childData1;
                      if(!inSnapshot.hasChild("0"))
                      {
                        childKey1 = inSnapshot.key;
                        childData1 = inSnapshot.val();
                        lista.push({'index':current.generateHead(childKey1),'respuesta':childData1,'esimagen':false});
                        if(current.state.queryHash[childKey1]){
                          current.state.queryHash[childKey1].push(childData1);
                        }else{
                          current.state.queryHash[childKey1] = [childData1];
                        }

                        if(VQ[childKey1])
                        {
                          VQ[childKey1].push(childData1);
                        }else
                        {
                          VQ[childKey1] = [childData1];
                        }
                      }else
                      {
                        childKey1  = "$$_Imagen";
                        childData1 = inSnapshot.child("0").val().name;

                        lista.push({'index':current.generateHead(childKey1),'respuesta':childData1,'esimagen':true});
                        if(current.state.queryHash[childKey1]){
                          current.state.queryHash[childKey1].push(childData1);
                        }else{
                          current.state.queryHash[childKey1] = [childData1];
                        }

                        if(VQ[childKey1])
                        {
                          VQ[childKey1].push(childData1);
                        }else
                        {
                          VQ[childKey1] = [childData1];
                        }
                      }
                    }
                });
                
              }
          );
          /*- carga de respuestas -*/

          /*- carga Para Segmentar -*/
          let latitude="";
          let longitude="";
          let date="";
          if (childSnapshot.hasChild("date"))
          {
            date  = childSnapshot.child("date").val();
            var dateVal ="/Date("+date+")/";
            var mydate = new Date( parseFloat( dateVal.substr(6 )));
            var convertDate = mydate.toLocaleDateString();
              
            if(!isNaN(mydate))
            {
              if(current.state.queryDate[convertDate]){
                current.state.queryDate[convertDate].push({"posicion":ARRAY.length,"key":childKey,"query":$.extend(true,{}, VQ)});
              }else{
                current.state.queryDate[convertDate] = [{"posicion":ARRAY.length,"key":childKey,"query":$.extend(true,{}, VQ)}];
              } 
            }
          }
          VQ = {};
          /*- carga Para Segmentar -*/
      


          /*- mapa -*/
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
            data : ARRAY.slice(),
            listafiltrada: ARRAY,
            queryMap : LMap,
            count : Tcount,
            referenceData : ARRAY,
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


  componentWillUpdate()
  {
    if(this.state.showComponent==2)
    {
      $(document).ready( function () {
        $('#example11').DataTable().destroy();
      });
    }    
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
          var datepicker = new ej.calendars.DatePicker({ width: "120px", placeholder: 'Fecha Inicial' });
          datepicker.appendTo('#datepickerIni');
          var datepicker = new ej.calendars.DatePicker({ width: "120px", placeholder: 'Fecha Final' });
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
    const { nombre,showGraphic,showComponent,loading,pregunta,gridAction,queryHash,queryDate,gridTipoCambio } = this.state;
    console.log("RENDERIZADO");    
    return (

      <div>
        
        <div id="graphic" className="graphicss">   
            <GridGraphs 
              pregunta          = {pregunta} 
              respuestas        = {queryHash}     
              cerrarGrafica     = {this.cerrarGrafica} 
              cerrarTodo        = {this.cerrarTodo} 
              gridAction        = {gridAction} 
              queryDate         = {queryDate}
              gridTipoCambio    = {gridTipoCambio}
              setTipoCambio     = {this.setTipoCambio}
            ></GridGraphs>
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

                          <div className="col-md-10"><input type="text" id="datepickerIni"/>
                          </div>
                          <div className="col-md-2"><input type="text" id="datepickerFin"/>
                          </div>

                      </div>
                      
                      <div className="form-group row">  
                        <a className="btn btn-block btn-success" onClick={this.segmentar}><i className="icon-shuffle icons" style={{margin_right:"5px"}} onClick={this.segmentar}> </i>Segmentar</a>
                        <a className="btn btn-block btn-success" onClick={this.segmentarTodo}><i className="icon-shuffle icons" style={{margin_right:"5px"}} onClick={this.segmentar}> </i>MostrarTodo</a>
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
      if(tempElement.esimagen)
      {
        return <button name={tempElement.respuesta} onClick={this.cargarImagenStorage}>ver</button>;
      }else
      {
        return tempElement.respuesta;
      }
      
    }
    else
    {
      return "";
    }
  }

  cargarImagenStorage(event)
  {
    var urlImagen = event.target.name;
    urlImagen = String(urlImagen).trim();
    storage.child('SurveyImages/'+urlImagen).getDownloadURL().then((url) => {
      document.getElementById("srcBodyIMG").src = url;
      $('#zoomModalIMG').modal('show');
    }).catch((error) => {
      alert("Imagen no encontrada");
    });    
  }
  prueba()
  {
    console.log("TERMINE");
  }

  //*Funcion que Segmenta Fecha Ini/Fin
  segmentar()
  {
      
      var NUEVO_ARRAY =[];
      var NUEVA_QUERYHASH = {};
      var iniDate = new Date(document.getElementById("datepickerIni").value);
      var finDate = new Date(document.getElementById("datepickerFin").value);

      var comp_date ;
      if(!isNaN(iniDate) && !isNaN(finDate))
      {
        if(iniDate<=finDate)
        {
            var keys = Object.keys(this.state.queryDate);
            keys.map(
              item =>{
                var numbers = item.match(/\d+/g); 
                comp_date = new Date(numbers[2], numbers[1]-1, numbers[0]);
                if(comp_date>=iniDate && comp_date<=finDate)
                {
                  var arr_respuesta =this.state.queryDate[item];
                  arr_respuesta.map(
                    index =>{
                        //NUEVA_QUERYHASH[index.key] = this.state.queryHash[index.key];
                        //console.log(this.state.data[index.posicion-1]);
                        //console.log(index.query);

                        Object.keys(index.query).map(
                          it =>
                          {
                            if(NUEVA_QUERYHASH[it]){
                              NUEVA_QUERYHASH[it].push(index.query[it][0]);
                            }else{
                              NUEVA_QUERYHASH[it] = [index.query[it][0]];
                            }
                          
                          }
                        );
                        NUEVO_ARRAY.push(this.state.data[index.posicion-1]);
                    }
                  );
                }
              }
            );
        }else
        {
          alert("Fecha Inicial debe ser Menor a Fecha Final");
        }
      }else
      {
        document.getElementById("datepickerIni").value = '';
        document.getElementById("datepickerFin").value = '';
      }
    
      this.setState({listafiltrada:NUEVO_ARRAY,queryHash:NUEVA_QUERYHASH,reloadGraph:!this.state.reloadGraph});
  }

  segmentarTodo()
  {
    this.setState({listafiltrada:this.state.referenceData});
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

        /*
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
        */
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

      /*try{
        var FILTER = document.getElementById("example11_filter");
        var inputNodes = FILTER.getElementsByTagName('INPUT');
        this.setState({textSearch:inputNodes[0].value});
      }catch(exx){}*/
      
      var mypregunta = document.getElementById("validationSelectedColum").value;
      var siCheck =false;
      if(document.getElementById("checkHistogram").checked)
      {
        siCheck =true;
        this.setState({gridAction:{tipo:0,pregunta:mypregunta}},()=>{this.state.gridAction=null;});
        /*this.setState({gridList:this.state.gridList.concat(0),pregunta:mypregunta
                      ,gridListHead:this.state.gridListHead.concat(mypregunta)});*/
      }
      if(document.getElementById("checkPie").checked)
      {
        siCheck =true;
        this.setState({gridAction:{tipo:1,pregunta:mypregunta}},()=>{this.state.gridAction=null;});
        /*this.setState({gridList:this.state.gridList.concat(1),pregunta:mypregunta
                      ,gridListHead:this.state.gridListHead.concat(mypregunta)});*/
      }
      
      if(siCheck)
      {        
        //this.setState({showGraphic:false});
        $('#exampleModal').modal('hide');
        //this.setState({showGraphic:true});
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