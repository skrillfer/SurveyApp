
var PieGraph = React.createClass({
    
    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    index : this.props.index,
                    queryDate : this.props.queryDate,
                    dataReference: null,
                    _Chart : null,
                    instanceChart : null,
                    _isPicker : false,
                };
    },
    componentDidUpdate: function()
    {
        console.log("DidUpdate");
        console.log(this.state._isPicker);
        if(!this.state._isPicker)
        {
            var datepicker = new ej.calendars.DatePicker({ width: "120px", placeholder: 'Fecha Inicial' });
            datepicker.appendTo('#datepickerIni');
            var datepicker = new ej.calendars.DatePicker({ width: "120px", placeholder: 'Fecha Final' });
            datepicker.appendTo('#datepickerFin');  
            this.state._isPicker = true;  
        }
    
    }
    ,
    componentDidMount: function()
    {
        console.log(this.state._isPicker);
        console.log("DidMount");
        try{
            this.mostrarGraficaDeColumna("");   
        }catch(ex){}
        
        if(!this.state._isPicker)
        {
            var datepicker = new ej.calendars.DatePicker({ width: "110px", placeholder: 'Fecha Inicial' });
            datepicker.appendTo('#datepickerIni'+this.state.index);
            var datepicker = new ej.calendars.DatePicker({ width: "110px", placeholder: 'Fecha Final' });
            datepicker.appendTo('#datepickerFin'+this.state.index);  
            this.state._isPicker = true;
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
        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
            }
        );
        
        try{this.generarGraficaPie(ejeX,ejeY,this.state.pregunta);}catch(ex)
        {
            this.eliminarInstanciaGrafica();
        }
          
        
    },
    generarGraficaPie(ejeX,ejeY,pregunta)
    {
        var colors =[] ;
        var total=ejeY.reduce(this.getSum);
        var porcentajes = [];
        ejeY.map(
            item =>
            {
                porcentajes.push((item/total)*100);
                colors.push(this.getRandomColor());
            }
        );
        
        this.eliminarInstanciaGrafica();            
        var ctx = document.getElementById("graphContainerP"+this.state.index).getContext('2d');
        var template = {
            type: 'pie',
            data : {
                datasets: [{
                    data: porcentajes,
                    backgroundColor : colors 
                }],
            
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ejeX
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },title: {
                    display: true,
                    text: 'Pie de '+pregunta
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

        document.getElementById("exampleModalLabel").innerText="Pie Chart";;

        var mycanvas = document.createElement("canvas");
        zoomBody.appendChild(mycanvas);


        var ctx = mycanvas.getContext('2d');
        new Chart(ctx, this.state._Chart);

        $('#zoomModal').modal('show');        
    }
    ,
    getSum(total, num) 
    {
        return total + num;
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
    },

    //*Funcion que Segmenta Fecha Ini/Fin
    segmentar()
    {
        
        //var NUEVO_ARRAY =[];
        var NUEVA_QUERYHASH = {};
        var iniDate = new Date(document.getElementById("datepickerIni"+this.state.index).value);
        var finDate = new Date(document.getElementById("datepickerFin"+this.state.index).value);

        var comp_date ;
        if(!isNaN(iniDate) && !isNaN(finDate))
        {
            if(iniDate<finDate)
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
                            //NUEVO_ARRAY.push(this.state.data[index.posicion-1]);
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
            document.getElementById("datepickerIni"+this.state.index).value = '';
            document.getElementById("datepickerFin"+this.state.index).value = '';
        }
        this.state.dataReference = this.state.respuestas;
        this.state.respuestas = NUEVA_QUERYHASH;
        this.mostrarGraficaDeColumna("");
    },segmentarTodo()
    {
        this.state.respuestas = this.state.dataReference;
        this.state.dataReference = null;
        this.mostrarGraficaDeColumna("");
    },
    render() {
        return (
            <div id ={"contenedorPie"+this.state.index} className = "center-block">
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
                            <button   id={this.state.index} type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-sm btn-danger"><strong id={this.state.index}>QUITAR</strong></button>
                            <button   type="button"  onClick = {this.zoomGrafica} className="btn btn-sm btn-secondary"><strong>ZOOM</strong><span className="glyphicon glyphicon-zoom-in"></span></button>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <input  className="form-control" id="input1-group2" type="text" name="input1-group2" placeholder="search" style={{width:"inherit",heigth:"inherit"}} onChange={this.filtrar} />
                    </div>
                   

                </div>                    
                <canvas  id={"graphContainerP"+this.state.index} >
                </canvas>
                <hr />
            </div>
        )
    }
});
