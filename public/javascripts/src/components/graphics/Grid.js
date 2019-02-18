var GridGraphs = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    children      : this.props.children, 
                    childrenComponents : [],     
                    gridListHead : this.props.gridListHead,              
                };
    },
    componentWillMount: function()
    {
        this.crearGraphEnum();
        
    },
    crearGraphEnum()
    {
        console.log('RESPUESTASAAAA');
        console.log(this.state.respuestas);
        console.log(this.state.pregunta);

        this.state.children.map(
            (item,index) =>
            {
                switch(item)
                {
                    case 0:
                    this.state.childrenComponents.push(
                            <div id={"card_"+index} className = "card">
                                <div className ="card-header">
                                    Histogram Chart
                                </div>
                                <div className ="card-body">
                                    <HistogramaGraph 
                                        cerrarGrafica = {this.state.cerrarGrafica} 
                                        pregunta = {this.state.gridListHead[index]} 
                                        respuestas = {this.state.respuestas}
                                        index = {index}
                                    ></HistogramaGraph>
                                </div>
                            </div>);
                    break;        
                    case 1:
                    
                    this.state.childrenComponents.push(
                            <div id={"card_"+index} className = "card">
                                <div className ="card-header">
                                    Pie Chart
                                </div>
                                <div className ="card-body">
                                    <PieGraph 
                                        cerrarGrafica = {this.state.cerrarGrafica} 
                                        pregunta = {this.state.gridListHead[index]} 
                                        respuestas = {this.state.respuestas}
                                        index = {index}
                                ></PieGraph>
                                </div>
                            </div>);
                    break;        
                }
            }    
        )
        
    }
    ,
    agregarGraph(item)
    {

        console.log(item.histogram);
        console.log(item.pie);
    }
    ,
    render() {
        return (
            <div className="container-fluid">
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

