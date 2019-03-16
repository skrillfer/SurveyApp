var GridGraphs = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    cerrarTodo : this.props.cerrarTodo,
                    children      : this.props.children, 
                    childrenComponents : [],     
                    gridListHead : this.props.gridListHead,  
                    reloadGraph  : this.props.reloadGraph, 
                };
    },
    /*componentWillReceiveProps:function(Nextprops) 
    {
        if(Nextprops.reloadGraph!=this.state.reloadGraph)
        {
            console.log("1x");
            this.setState({ 
                respuestas : Nextprops.respuestas,
                }
            );
            console.log("2x");
        }
        this.crearGraphEnum();
    },*/
    componentWillMount: function()
    {
    },
    componentWillUpdate:function()
    {
    },
    componentDidUpdate: function()
    {        
    },
    componentDidMount: function()
    {
        this.crearGraphEnum();
    }
    ,
    cerrar_Todo()
    {
        document.getElementById("Gridloader").style.display = "block";
        document.getElementById("ui-view").style.display = "none";

        var current = this;
        setTimeout(function(){ 
            
            current.setState({childrenComponents:[],gridListHead:[]},
                ()=>{current.state.cerrarTodo();}
            );
        }, 3000);

    }
    ,
    cerrarGraph(event)
    {

        document.getElementById("Gridloader").style.display = "block";
        document.getElementById("ui-view").style.display = "none";

        var index = event.target.id;

        var hijos=this.state.childrenComponents;
    
        let gridListHead1 = [];
        if(hijos.length==1)
        {
            hijos=[]; 
            
        }else
        {
            hijos = hijos.filter((_, i) => i !== parseInt(index));
            gridListHead1 = this.state.gridListHead.filter((_,item) => item !== parseInt(index));
        }
        var current = this;
        setTimeout(function(){ 
            
            current.setState({childrenComponents:hijos,gridListHead:gridListHead1},
                ()=>{current.state.cerrarGrafica(index);}
            );
        }, 3000);

        
    },
    crearGraphEnum()
    {
        var ARRAY = [];
        this.state.children.map(
            (item,index) =>
            {
                switch(item)
                {
                    case 0:

                    ARRAY.push(
                            <div id={"card_"+index} className = "card col-sm-6">
                                <div className ="card-header">
                                    Histogram Chart
                                </div>
                                <div className ="card-body">
                                    <HistogramaGraph 
                                        cerrarGrafica = {this.cerrarGraph} 
                                        pregunta = {this.state.gridListHead[index]} 
                                        respuestas = {this.state.respuestas}
                                        index = {index}
                                    ></HistogramaGraph>
                                </div>
                            </div>);
                    break;        
                    case 1:
                    
                    ARRAY.push(
                                <div id={"card_"+index} className = "col-sm-6 col-md-6">
                                    <div className="card">
                                        <div className ="card-header">
                                            
                                            {/*<div className = "card-header-actions">/*}
                                                {/* Segmentar*/}
                                                <div className="col-md-3">
                                                    Pie Chart
                                                </div>
                                                <div className="col-md-4"><input type="text" id={"datepickerIni"+index}/>
                                                </div>
                                                <div className="col-md-2"><input type="text" id={"datepickerFin"+index}/>
                                                </div>
                                                {/* Segmentar*/}

                                                <div className = "card-header-actions">
                                                    <div className="btn-group float-right">
                                                        <button className="btn btn-settings dropdown-toggle p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="icon-settings"></i>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item">Mostrar Todo</a>
                                                            <a className="dropdown-item">Segmentar</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/*</div>*/}
                                            

                                            
                                            
                                        </div>
                                        
                                        <div className ="card-body">
                                            <PieGraph 
                                                cerrarGrafica = {this.cerrarGraph} 
                                                pregunta = {this.state.gridListHead[index]} 
                                                respuestas = {this.state.respuestas}
                                                index = {index}
                                            ></PieGraph>
                                        </div>
                                        
                                    </div>    
                                </div>
                            );
                    break;        
                }
            }    
        );
        this.setState({childrenComponents:ARRAY});  
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

