var GridGraphs = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    children      : this.props.children, 
                    childrenComponents : [],     
                    gridListHead : this.props.gridListHead,   
                    isTrue:false,          
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
    },
    cerrarGraph(event)
    {

        var index = event.target.id;
        var hijos=this.state.childrenComponents;
        if(hijos.length==1)
        {
            hijos=[];
        }else
        {
            hijos = hijos.filter((_, i) => i !== parseInt(index));
        }
        
        console.log("$##$#$#$#$#$#$#$#$#$#$#$");
        console.log('index:'+index);
        console.log(hijos);

        this.setState({childrenComponents:hijos},()=>{this.state.cerrarGrafica(index);});
        
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
        )
    }
});

