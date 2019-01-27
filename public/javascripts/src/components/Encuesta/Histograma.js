var Grafica = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    encabezados: this.props.encabezados,
                    respuestas : this.props.respuestas
                };
    },
    componentDidMount: function()
    {
        this.mostrarGraficaDeColumna();
    }
    ,
    uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    },

    mostrarGraficaDeColumna: function()
    {
        var x = new Array();
        this.state.respuestas.map(lt =>
            {
                var LTFilter=lt.lista.filter( subitem => subitem.pregunta==this.state.pregunta);
                x.push(LTFilter[0].respuesta);
            }

        );
        x = x.sort();
        
        
        var ejeX = this.uniq(x);
        var ejeY = [];
        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
            }
        );

        this.generarHistograma(ejeX,ejeY,this.state.pregunta);
    },

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
          }
        };
        Plotly.newPlot('histograma', data, layout, {responsive: true});    
    },
    render() {
        return (
            <div id ="contenedorHistograma">

                <h3>GRAFICOS</h3>
                
                <div id="histograma">

                </div>
            </div>
        )
    }
});


