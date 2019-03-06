var HistogramaGraph = React.createClass({

    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    index : this.props.index,
                    _Chart : null,
                    instanceChart : null,
                };
    },
    componentDidMount: function()
    {
        try{
            this.mostrarGraficaDeColumna("");   
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

    mostrarGraficaDeColumna(filtro)
    {
        var x = [];
    
        x = this.state.respuestas[this.state.pregunta];
        x = x.sort();
        
        
        var ejeX = this.uniq(x);

        if(filtro!="")
        {
            ejeX = ejeX.filter(function(item){
                return item.toString().toLowerCase().search(
                  filtro.toString().toLowerCase()) !== -1;
              });
        }

        var ejeY = [];
        var colors =[] ;

        ejeX.map(item =>
            {
                ejeY.push(x.filter(subitem => subitem === item).length);
                colors.push(this.getRandomColor());
            }
        );
        try{this.generarHistograma(ejeX,ejeY,this.state.pregunta,colors);}catch(ex)
        {
            this.eliminarInstanciaGrafica();
        }
        
    },
    generarHistograma(ejeX,ejeY,pregunta,colors)
    {
        
        this.eliminarInstanciaGrafica();            
        var ctx = document.getElementById("graphContainerH"+this.state.index).getContext('2d');
        var template = {
            type: 'bar',
            data: {
              labels: ejeX,
              datasets: [{
                data: ejeY,
                label:"",
                backgroundColor: colors,
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
          };

        var myChart = new Chart(ctx, template);
        this.state.instanceChart = myChart;
        this.state._Chart = template;

    },
    zoomGrafica()
    {
        
        var zoomBody = document.getElementById("zoomBody");

        while (zoomBody.firstChild) {
            zoomBody.removeChild(zoomBody.firstChild);
        }

        document.getElementById("exampleModalLabel").innerText="Pie Chart";;

        var mycanvas = document.createElement("canvas");
        zoomBody.appendChild(mycanvas);


        var ctx = mycanvas.getContext('2d');
        new Chart(ctx, this.state._Chart);

        $('#zoomModal').modal('show');        
    },
    eliminarInstanciaGrafica()
    {
        if(this.state.instanceChart!=null)
        {
            this.state.instanceChart.destroy();
            this.state.instanceChart = null;
        }
    },
    filtrar(event)
    {
        this.mostrarGraficaDeColumna(event.target.value);
    },
    render() {
        return (
            <div id ={"contenedorHistograma"+this.state.index} className = "center-block">

            <div className="form-group row">
                <div className="col-md-6">
                    <div className="text-left">
                        <button id={this.state.index} type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-sm btn-danger"><strong id={this.state.index} >QUITAR</strong></button>
                        <button   type="button"  onClick = {this.zoomGrafica} className="btn btn-sm btn-secondary"><strong>ZOOM</strong><span className="glyphicon glyphicon-zoom-in"></span></button>
                    </div>
                </div>
                <div className="col-md-4">
                        <input  className="form-control" id="input1-group2" type="text" name="input1-group2" placeholder="search" style={{width:"164px"}} onChange={this.filtrar} />
                </div>
            </div>
                
            <canvas  id={"graphContainerH"+this.state.index} >

            </canvas>
            <hr />
            </div>
        )
    }
});


