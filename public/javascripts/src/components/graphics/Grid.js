var GridGraphs = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    encabezados: this.props.encabezados,
                    respuestas : this.props.respuestas,
                    tipo: this.props.tipo,
                    cerrarGrafica : this.props.cerrarGrafica,
                    gridList      : this.props.gridList,
                    
                };
    },
    componentDidMount: function()
    {
       
        
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
                            <div className = "card-columns cols-2">
                                {
                                    this.state.gridList.map(
                                        (item,key_pregunta)=> (
                                            console.log(key_pregunta),
                                            this.state.gridList[key_pregunta].map
                                            (
                                                item_graph => agregarGraph(item_graph)
                                            )
                                        )
                                    )
                                }
                                <div className = "card">
                                    <div className ="card-header">
                                        Pie Chart
                                    </div>
                                    <div className ="card-body">
                                       <PieGraph cerrarGrafica = {this.state.cerrarGrafica} tipo= {this.state.tipo} pregunta = {this.state.pregunta} 
                                                 encabezados = {this.state.encabezados} respuestas = {this.state.respuestas}/>
                                    </div>
                                </div>
                                <div className = "card">
                                    <div className ="card-header">
                                        Histogram Chart
                                    </div>
                                    <div className ="card-body">
                                    <HistogramaGraph cerrarGrafica = {this.state.cerrarGrafica} tipo= {this.state.tipo} pregunta = {this.state.pregunta} 
                                                 encabezados = {this.state.encabezados} respuestas = {this.state.respuestas}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

