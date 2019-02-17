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
        
    },
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
        var colors =[] ;

        var total=ejeY.reduce(this.getSum);
        var porcentajes = [];
        ejeY.map(
            item =>
            {
                porcentajes.push((item/total)*100);
                colors.push(this.getRandomColor());
            }
        );
        
        var ctx = document.getElementById("graphContainerP").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data : {
                datasets: [{
                    data: porcentajes,
                    backgroundColor : colors 
                }],
            
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ejeX
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        /*
        var data = [{
            values: porcentajes,
            labels: ejeX,
            type: "pie"
          }];
          
        var layout = {
        height: 400,
        width: 500
        };
        
        Plotly.newPlot('graphContainerP', data, layout);*/
    },
    getSum(total, num) 
    {
        return total + num;
    },
    render() {
        return (
            <div id ="contenedorPie" className = "center-block">
            <div class="row">
                <div class="col-xs-12">
                    <div class="text-left">
                        <button type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span></button>
                    </div>
                </div>
            </div>
                
            <canvas  id="graphContainerP" >

            </canvas>
            <hr />
            </div>
        )
    }
});
