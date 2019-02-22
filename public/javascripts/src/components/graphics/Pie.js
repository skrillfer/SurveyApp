
var PieGraph = React.createClass({
    
    getInitialState: function() {
        return {    
                    pregunta: this.props.pregunta, 
                    respuestas : this.props.respuestas,
                    cerrarGrafica : this.props.cerrarGrafica,
                    index : this.props.index,
                    _Chart : null,
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
        
        try{this.generarGraficaPie(ejeX,ejeY,this.state.pregunta);}catch(ex){}
          
        
    },
    generarGraficaPie(ejeX,ejeY,pregunta)
    {
        console.log("index");
        console.log(this.state.index);
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
        
        var ctx = document.getElementById("graphContainerP"+this.state.index).getContext('2d');
        var template = {
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
                },title: {
                    display: true,
                    text: 'Pie de '+pregunta
                  }
            }
        };

        var myChart = new Chart(ctx, template);
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
    }
    ,
    getSum(total, num) 
    {
        return total + num;
    },
    render() {
        return (
            <div id ={"contenedorPie"+this.state.index} className = "center-block">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="text-left">
                            <button  id={this.state.index} type="button"  onClick = {this.state.cerrarGrafica} className="btn btn-danger">x</button>
                            <button   type="button"  onClick = {this.zoomGrafica} className="btn btn-secondary">|<span className="glyphicon glyphicon-zoom-in"></span>|</button>

                        </div>
                    </div>
                </div>
                    
                <canvas  id={"graphContainerP"+this.state.index} >

                </canvas>
                <hr />
            </div>
        )
    }
});
