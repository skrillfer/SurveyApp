var PieGraph = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    encabezados: this.props.encabezados,
                    respuestas : this.props.respuestas,
                    tipo: this.props.tipo,
                    cerrarGrafica : this.props.cerrarGrafica,
                };
    },
    componentDidMount: function()
    {
        try{
            this.mostrarGraficaDeColumna("histograma");   
        }catch(ex){}
        
    }
    ,
    uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    },

    mostrarGraficaDeColumna: function(tipo)
    {
        var x = [];
    
        x = this.state.respuestas[this.state.pregunta];
        x = x.sort();
        
        
        var ejeX = this.uniq(x);

        var ejeY = [];
        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
            }
        );
        
        try{this.generarGraficaPie(ejeX,ejeY,this.state.pregunta);}catch(ex){}
          
        
    },
    generarGraficaPie(ejeX,ejeY,pregunta)
    {
        var total=ejeY.reduce(this.getSum);
        var porcentajes = [];
        ejeY.map(
            item =>
            {
                porcentajes.push((item/total)*100);
            }
        );

        var data = [{
            values: porcentajes,
            labels: ejeX,
            type: "pie"
          }];
          
        var layout = {
        height: 400,
        width: 500
        };
        
        Plotly.newPlot('graphContainer', data, layout);
    },
    getSum(total, num) 
    {
        return total + num;
    },
    render() {
        return (
            <div id ="contenedorHistograma" className = "center-block">
            <div className="btn-group btn-group-justified" role="group" aria-label="...">
                <div className="btn-group" role="group">
                    <button type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span></button>
                </div>
            </div>
                
            <div  id="graphContainer" >

            </div>
            <hr />
            </div>
        )
    }
});
