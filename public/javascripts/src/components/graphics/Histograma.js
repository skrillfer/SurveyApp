var HistogramaGraph = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta       : this.props.pregunta, 
                    respuestas     : this.props.respuestas,
                    cerrarGrafica  : this.props.cerrarGrafica,
                    index          : this.props.index,
                    queryDate      : this.props.queryDate,
                    initParam      : this.props.initParam,
                    dataReference  : null,
                    _Chart : null,
                    instanceChart : null,
                    _isPicker : false,
                };
    },
    componentDidMount: function()
    {
        console.log("--H-DidMount");
        var ini = '';
        var fin = '';
        if(this.state.initParam!=null)
        {
            try {
                ini = new Date(this.state.initParam.dateIni);
                fin = new Date(this.state.initParam.dateFin);    
            } catch (error) {
                ini = new Date();
                fin = new Date();
            }
            
        }   
        
        if(!this.state._isPicker)
        {
            var datepicker = new ej.calendars.DatePicker({ width: "inherit", placeholder: 'Fecha Inicial', value : ini });
            datepicker.appendTo('#datepickerIni'+this.state.index);
            var datepicker = new ej.calendars.DatePicker({ width: "inherit", placeholder: 'Fecha Final', value : fin });
            datepicker.appendTo('#datepickerFin'+this.state.index);  
            this.state._isPicker = true;
        }
            
        if(this.state.initParam!=null)
        {
            if(!isNaN(ini) && !isNaN(fin))
            {
                this.segmentar();
            }
            

            var search = this.state.initParam.search;
            //set input search
            document.getElementById("input_search"+this.state.index).value = search;
            this.mostrarGraficaDeColumna(search);

        }else
        {
            try{
                this.mostrarGraficaDeColumna("");   
            }catch(ex){}
        }
        
    },
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    ,
    uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    },

    mostrarGraficaDeColumna(filtro)
    {
        var x = [];
    
        x = this.state.respuestas[this.state.pregunta];

        /*Cantidad de Respuestas  = 0*/
        if(x==null)
        {
            this.eliminarInstanciaGrafica();
            this.state._Chart = null;
            return;
        }
        /*Cantidad de Respuestas  = 0*/

        x = x.sort();
        
        
        var ejeX = this.uniq(x);

        if(filtro!="")
        {
            ejeX = ejeX.filter(function(item){
                return item.toString().toLowerCase().search(
                  filtro.toString().toLowerCase()) !== -1;
              });
        }

        var ejeY = [];
        var colors =[] ;

        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
                colors.push(this.getRandomColor());
            }
        );

        try{
            this.generarHistograma(ejeX,ejeY,this.state.pregunta,colors);
        }catch(ex){
            this.eliminarInstanciaGrafica();
        }
        
    },
    generarHistograma(ejeX,ejeY,pregunta,colors)
    {
        
        this.eliminarInstanciaGrafica();            
        var ctx = document.getElementById("graphContainerH"+this.state.index).getContext('2d');
        var template = {
            type: 'bar',
            data: {
              labels: ejeX,
              datasets: [{
                data: ejeY,
                label:"",
                backgroundColor: colors,
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                xAxes: [{
                  ticks: {
                    maxRotation: 90,
                    minRotation: 80
                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              title: {
                display: true,
                text: 'Histograma de '+pregunta
              }
            }
          };

        var myChart = new Chart(ctx, template);
        this.state.instanceChart = myChart;
        this.state._Chart = template;

    },
    zoomGrafica()
    {
        
        var zoomBody = document.getElementById("zoomBody");

        while (zoomBody.firstChild) {
            zoomBody.removeChild(zoomBody.firstChild);
        }

        document.getElementById("exampleModalLabel").innerText="Histogram Chart";

        if(this.state._Chart!=null)
        {

            var mycanvas = document.createElement("canvas");
            zoomBody.appendChild(mycanvas);


            var ctx = mycanvas.getContext('2d');
            new Chart(ctx, this.state._Chart);

        }
        $('#zoomModal').modal('show');  
    },
    eliminarInstanciaGrafica()
    {
        if(this.state.instanceChart!=null)
        {
            this.state.instanceChart.destroy();
            this.state.instanceChart = null;
        }
    },
    filtrar(event)
    {
        this.mostrarGraficaDeColumna(event.target.value);
    },//*Funcion que Segmenta Fecha Ini/Fin
    segmentar()
    {
        
        var NUEVA_QUERYHASH = {};
        var iniDate = new Date(document.getElementById("datepickerIni"+this.state.index).value);
        var finDate = new Date(document.getElementById("datepickerFin"+this.state.index).value);

        var comp_date ;
        if(!isNaN(iniDate) && !isNaN(finDate))
        {

            if(iniDate<=finDate)
            {
                if (this.state.dataReference!=null) 
                {
                    this.state.respuestas = this.state.dataReference;
                }
                
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
                        }
                    );
                    }
                });
                document.getElementById("input_search"+this.state.index).value = '';
                this.state.dataReference = this.state.respuestas;
                this.state.respuestas = NUEVA_QUERYHASH;
                this.mostrarGraficaDeColumna("");
            }else
            {
                alert("Fecha Inicial debe ser Menor a Fecha Final");
            }
        }else
        {
            alert("Fechas incorrectas");
        }
    },
    segmentarTodo()
    {
        if (this.state.dataReference!=null) 
        {
            this.state.respuestas = this.state.dataReference;
            this.state.dataReference = null;
        }
        document.getElementById("input_search"+this.state.index).value = '';
        this.mostrarGraficaDeColumna("");
    },
    render() {
        return (
            <div id ={"contenedorHistograma"+this.state.index} className = "center-block">
            <div className = "card-header-actions">
                    <div className="btn-group float-right">
                        <button className="btn btn-settings dropdown-toggle p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="icon-settings"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" onClick={this.segmentar}     >Segmentar</a>
                            <a className="dropdown-item" onClick={this.segmentarTodo} >Mostrar Todo</a>
                        </div>
                    </div>
            </div>
            <div className="form-group row">
                <div className="col-md-8">
                    <div className="text-left">
                        <button id={this.state.index} type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-sm btn-danger"><strong id={this.state.index} >QUITAR</strong></button>
                        <button   type="button"  onClick = {this.zoomGrafica} className="btn btn-sm btn-secondary"><strong>ZOOM</strong><span className="glyphicon glyphicon-zoom-in"></span></button>
                    </div>
                </div>
                <div className="col-md-4">
                        <input  className="form-control" id={"input_search"+this.state.index} type="text" name="input1-group2" placeholder="search" style={{width:"inherit",heigth:"inherit"}} onChange={this.filtrar} />
                </div>
            </div>
                
            <canvas  id={"graphContainerH"+this.state.index} >
            </canvas>
            <hr />
            </div>
        )
    }
});


