var Grafica = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    encabezados: this.props.encabezados,
                    respuestas : this.props.respuestas,
                    tipo: this.props.tipo,
                };
    },
    componentDidMount: function()
    {
        console.log('VAMOS A GENERAR:'+this.state.tipo);
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
        var x = [];
        // this.state.respuestas.map(lt =>
        //     {
        //         console.log(this.state.pregunta);
        //         var LTFilter=lt.lista.filter( subitem => subitem.pregunta==this.state.pregunta);
        //         if(LTFilter.length>0){
        //             x.push(LTFilter[0].respuesta);
        //         }                
        //     }

        // );
        x = this.state.respuestas[this.state.pregunta];
        x = x.sort();
        
        
        var ejeX = this.uniq(x);

        var ejeY = [];
        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
            }
        );
        

        if(this.state.tipo=='pie')
        {
            this.generarGraficaPie(ejeX,ejeY,this.state.pregunta);
        }else
        {
            this.generarHistograma(ejeX,ejeY,this.state.pregunta);
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
            type: this.state.tipo
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
            <div id ="contenedorHistograma">
                <h3>GRAFICOS</h3>
                <div id="histograma">

                </div>
            </div>
        )
    }
});


