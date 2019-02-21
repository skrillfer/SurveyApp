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
                };
    },
    componentWillMount: function()
    {
        //$('#modalWait').modal('show');
        //this.crearGraphEnum();
        
    },
    componentDidUpdate: function()
    {

        
        //console.log("he sido actualizado");
        //$(".alert").alert('close');
        
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
        document.getElementById("GridCerrarTodo").style.display = "none";

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
        document.getElementById("GridCerrarTodo").style.display = "none";

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
        console.log('RESPUESTASAAAA');
        console.log(this.state.respuestas);
        console.log(this.state.pregunta);

        var ARRAY = [];
       
        this.state.children.map(
            (item,index) =>
            {
                switch(item)
                {
                    case 0:

                    ARRAY.push(
                            <div id={"card_"+index} className = "card">
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
                            <div id={"card_"+index} className = "card">
                                <div className ="card-header">
                                    Pie Chart
                                </div>
                                <div className ="card-body">
                                    <PieGraph 
                                        cerrarGrafica = {this.cerrarGraph} 
                                        pregunta = {this.state.gridListHead[index]} 
                                        respuestas = {this.state.respuestas}
                                        index = {index}
                                ></PieGraph>
                                </div>
                            </div>);
                    break;        
                }
            }    
        );
        this.setState({childrenComponents:ARRAY});
        
    }
    ,
    agregarGraph(item)
    {

        console.log(item.histogram);
        console.log(item.pie);
    }
    ,
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
                <div className="row row justify-content-md-center">
                    <div id="GridCerrarTodo"  className="col text-center">
                        <button  type="button" className="btn btn-secondary" onClick = {this.cerrar_Todo}>Cerrar Todo</button>
                    </div>
                    <hr/>
                </div>
                <div className="row">
                    <div id="ui-view">    
                        <div>
                            <div className = "animated fadeIn">
                                <div id="myform_cards" className = "card-columns cols-2">
                                    {this.state.childrenComponents}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

