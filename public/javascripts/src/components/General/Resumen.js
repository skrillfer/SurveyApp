var Resumen = React.createClass({
    getInitialState: function() {
        return {    
                    queryMap: this.props.queryMap, 
                };

                
    },
    componentWillReceiveProps:function(props) {
        this.setState({ queryMap: props.queryMap })
    }, 
    render()
    {
        console.log('General renderizado');
        return(
                <div className="card card-cascade narrower">

                    <div className="view view-cascade gradient-card-header blue-gradient">
                        <h5 className="mb-0">Mapa General</h5>
                    </div>

                    <div className="card-body card-body-cascade text-center">
                        <Mapa queryMap = {this.state.queryMap}></Mapa>
                    </div>

                </div>
        )
    }
    
});