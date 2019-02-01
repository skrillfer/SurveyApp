
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
            top: '100px',
            border: '2px solid gray',
            
          }; 
        return (
            <div className='popup' style={divStyle} >
                <div className='popup_inner'>
                <h4>{this.props.text}</h4>
                <button className="btn btn-success btn-md" id="histogram" onClick={this.props.clickGenerarGrafico}>Aceptar</button>
                <button className="btn btn-danger btn-xs" onClick={this.props.closePopup}>Cancelar</button>
                </div>
            </div>    
        );
    }
});




