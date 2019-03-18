var GridGraphs = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    cerrarTodo : this.props.cerrarTodo,
                    gridAction : this.props.gridAction,
                    childrenComponents : [],     
                    queryDate  : this.props.queryDate, 
                    gridTipoCambio : this.props.gridTipoCambio,
                };
    },
    componentWillReceiveProps:function(Nextprops) 
    {
        if(Nextprops.gridAction!=null)
        {
            this.setState({ 
                    gridAction : Nextprops.gridAction,
                },()=>{
                    this.crearGraphEnum(true);
                }
            );
        }else
        {
            /*this.setState({childrenComponents:[]},()=>{
                this.crearGraphEnum();
            });*/

            if(Nextprops.gridTipoCambio==1)
            {
                //El cambio producido es por la base de datos
                var tmpComponents = this.state.childrenComponents.slice();
                this.state.childrenComponents = [];

                this.reset(tmpComponents);
        
                
               
                /*
                this.setState({respuestas:Nextprops.respuestas,tipoCambio:1});
                console.log("Ha cambiado la base de datos");*/
                /*this.setState({respuestas:Nextprops.respuestas,childrenComponents:[]},()=>{
                    this.crearGraphEnum();
                });*/
            }
            console.log("otro tipo de actualizacion:"+Nextprops.gridTipoCambio);
        }
    },
    reset(arr)
    {
        arr.map(
            (child,i) =>
            {
                this.state.gridAction ={tipo:child.props.name,pregunta:child.props.title};
                if((i+1)== arr.length)
                {
                    this.crearGraphEnum(true);
                    
                }else
                {
                    this.crearGraphEnum(false);
                }
                
            }
        );
    },
    componentWillMount: function()
    {
    },
    componentWillUpdate:function()
    {
        console.log("Sera actualizado");
    },
    componentDidUpdate: function()
    {        
    },
    componentDidMount: function()
    {
        this.crearGraphEnum(true);      
    }
    ,
    cerrar_Todo()
    {
        this.setState({ childrenComponents :[]});
    }
    ,
    cerrarGraph(event)
    {
        var id = event.target.id;
        var hijos=this.state.childrenComponents;
        hijos = hijos.filter(v => v.props.id.toString() !== "card_"+id.toString());
        this.setState({childrenComponents: hijos});
    },
    
    crearGraphEnum(actualizar)
    {
        if(this.state.gridAction!=null)
        {
            var str_pregunta =  this.state.gridAction.pregunta; 
            var tipo         =  this.state.gridAction.tipo; 
            tipo =   parseInt(tipo) ;
            
            var d     = new Date();
            var index =  d.getTime() + this.state.childrenComponents.length;
            switch(tipo)
            {
                    case 0:
                        this.state.childrenComponents.push(
                                <div key={"His"+index} id={"card_"+index} title={str_pregunta} name ={tipo} className = "card col-sm-6">
                                    <div   className ="card-header">
                                        Histogram Chart
                                    </div>
                                    <div className ="card-body">
                                        <HistogramaGraph 
                                            cerrarGrafica = {this.cerrarGraph} 
                                            pregunta      = {str_pregunta} 
                                            respuestas    = {this.state.respuestas}
                                            index         = {index}
                                        ></HistogramaGraph>
                                    </div>
                                </div>
                        );
                    break; 
                    case 1:
                    
                        this.state.childrenComponents.push(
                            <div key={"Pie"+index} id={"card_"+index} title ={str_pregunta} name ={tipo} className = "col-sm-6 col-md-6">
                                <div  className="card">
                                    <div className ="card-header">
                                        
                                            {/* Segmentar */}
                                            <div className="col-md-4">
                                                Pie Chart
                                            </div>
                                            <div className="col-md-4"><input type="text" id={"datepickerIni"+index}/>
                                            </div>
                                            <div className="col-md-4"><input type="text" id={"datepickerFin"+index}/>
                                            </div>
                                            {/* Segmentar */}
                                    </div>
                                    
                                    <div className ="card-body">
                                        <PieGraph 
                                            cerrarGrafica = {this.cerrarGraph} 
                                            pregunta      = {str_pregunta} 
                                            respuestas    = {this.state.respuestas}
                                            index         = {index}
                                            queryDate     = {this.state.queryDate}
                                        ></PieGraph>
                                    </div>
                                    
                                </div>    
                            </div>
                        );
                    break;               
            }

            if(actualizar){
                this.setState({childrenComponents:this.state.childrenComponents});
            }
            
        }
    },
    render() {
        console.log("GRID RENDERIZADO");
        return (
                <div id="GridManager" className="container-fluid">
                    <div className="row justify-content-md-center">
                        <div id="Gridloader" style ={{display: 'none'}}  className="col text-center">
                            <div className="spinner-border text-warning" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div id="ui-view">    
                        <div>
                            <div className = "animated fadeIn">
                                <div id="myform_cards" className = "card-rows">
                                    {this.state.childrenComponents}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
});

