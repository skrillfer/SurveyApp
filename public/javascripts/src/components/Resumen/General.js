var Rsumen = React.createClass({
    getInitialState: function() {
        console.log('l-l-l-l-l-l-l');
        return {    
                    queryMap: this.props.queryMap, 
                };

                
    },
    componentWillReceiveProps:function(props) {
        this.setState({ queryMap: props.queryMap })
    }, 
    render()
    {
        var keys = Object.keys(this.state.queryMap);
        console.log(keys.length);

        console.log('General renderizado');
        return(
            <div className="row">
                {/* Mapa de calor */}
                <div className ="col-sm-6 col-lg-3">
                    <Mapa queryMap = {this.state.queryMap}></Mapa>
                </div>
            </div>
        )
    }
    
});