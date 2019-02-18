var HistogramaGraph = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    index : this.props.index,
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

    mostrarGraficaDeColumna: function()
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
        try{this.generarHistograma(ejeX,ejeY,this.state.pregunta);}catch(ex){}
        
    },
    generarHistograma(ejeX,ejeY,pregunta)
    {
        
        var ctx = document.getElementById("graphContainerH"+this.state.index).getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ejeX,
              datasets: [{
                data: ejeY,
                label:"",
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                xAxes: [{
                  ticks: {
                    maxRotation: 90,
                    minRotation: 80
                  }
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              title: {
                display: true,
                text: 'Histograma de '+pregunta
              }
            }
          });
    },
    render() {
        return (
            <div id ={"contenedorHistograma"+this.state.index} className = "center-block">

            <div className="row">
                <div className="col-xs-12">
                    <div className="text-left">
                        <button id={this.state.index} type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-danger">X</button>
                    </div>
                </div>
            </div>
                
            <canvas  id={"graphContainerH"+this.state.index} >

            </canvas>
            <hr />
            </div>
        )
    }
});


