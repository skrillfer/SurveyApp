
var ListBox = React.createClass({

    getInitialState: function() {
        return {
            options: [{
                id: 1,
                text: 'Wifi',
                icon: 'connection'
            }, {
                id: 2,
                text: 'Location',
                icon: 'location'
            }, {
                id: 3,
                text: 'Sound',
                icon: 'volume-medium'
            }, {
                id: 4,
                text: 'Rotation',
                icon: 'fa-rotate-left'
            }, {
                id: 5,
                text: 'Bluetooth',
                icon: 'ion-bluetooth'
            }, {
                id: 6,
                text: 'Settings',
                icon: 'cogs'
            }, {
                id: 7,
                text: 'Reading',
                icon: 'user4'
            }, {
                id: 8,
                text: 'Data',
                icon: 'download'
            }, {
                id: 9,
                text: 'Eye comfort',
                icon: 'eye'
            }, {
                id: 10,
                text: 'Screenshot',
                icon: 'mobile'
            }, {
                id: 11,
                text: 'Airplane Mode',
                icon: 'airplane'
            }, {
                id: 12,
                text: 'Alarm',
                icon: 'alarm2'
            }, {
                id: 13,
                text: 'Messages',
                icon: 'material-message'
            }, {
                id: 14,
                text: 'Weather',
                icon: 'meteo-weather4'
            }, {
                id: 15,
                text: 'Camera',
                icon: 'camera'
            }, {
                id: 16,
                text: 'Edit',
                icon: 'material-photo-size-select-large'
            }]
        }
    },
      
    
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




