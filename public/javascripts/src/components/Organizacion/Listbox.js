
var ListBox = React.createClass({


    render() {
    return (
        <div className='popup'>
            <div className='popup_inner'>
            <h1>{this.props.text}</h1>
            <button className="btn" id="histogram" onClick={this.props.clickGenerarGrafico}>Histrograma</button>
            <button className="btn" id="pie" onClick={this.props.clickGenerarGrafico}>Grafica de Pie</button>
            <button className="cancel" onClick={this.props.closePopup}>Cerrar</button>
            </div>
        </div>
    );
    }
});




