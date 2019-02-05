var Grafica = React.createClass({

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
        

        if(tipo=='pie')
        {
            try{this.generarGraficaPie(ejeX,ejeY,this.state.pregunta);}catch(ex){}
            
        }else
        {   
            try{this.generarHistograma(ejeX,ejeY,this.state.pregunta);}catch(ex){}
            
        }
        
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
        
        Plotly.newPlot('histograma', data, layout);
    },
    getSum(total, num) 
    {
        return total + num;
    }      
    ,
    generarHistograma(ejeX,ejeY,pregunta)
    {
        var trace1 = {
            type: 'bar',
            x: ejeX,
            y: ejeY,
            name: 'Cantidad',
            marker: {
                color: '#C8A2C8',
                line: {
                    width: 2.5
                }
            }
        };
        
        var data = [ trace1 ];
        
       
        var layout = {
          title: 'Histograma de '+pregunta,
          font: {size: 18},
          yaxis: {
            title: {
              text: 'Cantidad',
              font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
              }
            }
          },
          
        };
        Plotly.newPlot('histograma', data, layout, {responsive: true});    
    },
    render() {
        return (
            <div id ="contenedorHistograma" className = "center-block">
            <div className="btn-group btn-group-justified" role="group" aria-label="...">
                <div className="btn-group" role="group">
                    <button type="button" onClick = {() =>this.mostrarGraficaDeColumna("histograma")} className="btn btn-link">Histograma</button>
                </div>
                <div className="btn-group" role="group">
                    <button type="button"  onClick = {() =>this.mostrarGraficaDeColumna("pie")} className="btn btn-link">Pie</button>
                </div>
                <div className="btn-group" role="group">
                    <button type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span></button>
                </div>
            </div>
                
            <div  id="histograma" >

            </div>
            <hr />
            </div>
        )
    }
});


