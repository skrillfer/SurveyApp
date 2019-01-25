var Grafica = React.createClass({

    getInitialState: function() {
        return {    
                    prueba: this.props.prueba, 
                    encabezados: this.props.encabezados,
                    respuestas : this.props.respuestas
                };
      },
    uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    },
    handleChange(event) {
        this.setState({prueba: event.target.value});

        var x = new Array();
        this.state.respuestas.map(lt =>
            {
                var LTFilter=lt.lista.filter( subitem => subitem.pregunta==event.target.value);
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

        console.log(x);
        
        var trace1 = {
            type: 'bar',
            x: ejeX,
            y: ejeY,
            marker: {
                color: '#C8A2C8',
                line: {
                    width: 2.5
                }
            }
        };
        
        var data = [ trace1 ];
        
        var layout = {
          title: 'Responsive to windows size!',
          font: {size: 18}
        };
        
        Plotly.newPlot('histograma', data, layout, {responsive: true});
    },

    render() {
        return (
            <div >

                <h3>Selecciona la columna</h3>
                <select  onChange={this.handleChange} >
                {
                    this.state.encabezados.map( item =>
                        <option value={item.pregunta}>{item.pregunta}</option>
                    )
                }
                </select>
                <div id="histograma">

                </div>
            </div>
        )
    }
});


