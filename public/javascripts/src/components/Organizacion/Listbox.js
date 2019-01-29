
var ListBox = React.createClass({

    getInitialState: function() {
        return {
            posicion: this.props.posicion,
        };
    },

    render() {
        console.log(this.state.posicion);
        var left = this.state.posicion.left;
        var right = this.state.posicion.right;
        var color = 'green';
        console.log(right);
        const divStyle = {
            top: '140px',
            border: '2px solid gray',
            
          }; 
        return (
            <div className='popup' style={divStyle} >
                <div className='popup_inner'>
                <span>{this.props.text}</span>
                <button className="btn" id="histogram" onClick={this.props.clickGenerarGrafico}>Histrograma</button>
                <button className="btn" id="pie" onClick={this.props.clickGenerarGrafico}>Grafica de Pie</button>
                <button className="cancel" onClick={this.props.closePopup}>Cerrar</button>
                </div>
            </div>
        );
    }
});




