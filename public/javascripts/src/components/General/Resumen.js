var Resumen = React.createClass({
    getInitialState: function() {
        return {    
                    queryMap: this.props.queryMap, 
                    count   : this.props.count,
                    lastdate : '', 
                };

                
    },
    componentWillReceiveProps:function(props) {
        if(Object.keys(props.queryMap).length!=Object.keys(this.state.queryMap).length)
        {
            console.log('diferente!!');
            this.setState({ 
                queryMap: props.queryMap,
                count:props.count,
                lastdate: this.getLastDate(props.queryMap) 
            });
        }
    }, 
    getLastDate(queryMap)
    {
        var keys = Object.keys(queryMap);
        if(keys.length>0)
        {
            var last = queryMap[keys[keys.length-1]][0];
            var dateVal ="/Date("+last.date+")/";
            var date = new Date( parseFloat( dateVal.substr(6 )));
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        }
        return "sin registro";
    }
    ,
    render()
    {
        return(

            <div className="row">
                <div className="col-sm-6">
                    <div className="row">

                        <div className="col-sm-6">
                            <div className="callout callout-info">
                                <small className="text-muted">Numero de Respuestas</small> 
                                <br/>
                                <strong className="h4">{this.state.count}</strong>
                            </div>
                        </div>    


                        <div className="col-sm-6">
                            <div className="callout callout-info">
                                <small className="text-muted">La ultima Respuesta fue en:</small> 
                                <br/>
                                <strong className="h4">{this.state.lastdate}</strong>
                            </div>
                        </div>    
                    </div>
                </div>    

                <div className="col-md-12">
                        <div className="card card-cascade narrower">
                            <div className="card-header">
                                
                            </div>
                            <div className="card-body">
                                <Mapa queryMap = {this.state.queryMap}></Mapa>
                            </div>
                            <div className="card-footer">
                                Respuestas por Ubicacion
                            </div>
                        </div>
                </div>
            </div>


        )
    }
    
});