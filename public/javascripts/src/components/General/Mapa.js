var Mapa = React.createClass({

    getInitialState: function() {
        return {    
                    queryMap: this.props.queryMap, 
                    map : null,
                    markers : null,
                };

    },
    componentWillReceiveProps:function(nextprops) {
        if(Object.keys(nextprops.queryMap).length!=Object.keys(this.state.queryMap).length)
        {
            this.setState({ queryMap: nextprops.queryMap},()=>{this.renderizarMapa();});
        }
    },

    componentDidMount: function()
    {
        this.markers = L.layerGroup();
        this.renderizarMapa();
    }
    ,
    componentDidUpdate: function()
    {   
        
    },
    renderizarMapa()
    {
        var keys = Object.keys(this.state.queryMap);
        if(keys.length>0)
        {
            var Xpoint = this.state.queryMap[keys[0]][0]; 
            if(this.map==null)
            {
                this.map = L.map('map', {
                    maxZoom: 18
                });
                this.markers.clearLayers();

                this.map.setView([Xpoint.latitude, Xpoint.longitude], 13);
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                    maxZoom: 18
                }).addTo(this.map);

            }else
            {
                this.map.removeLayer(this.markers);
                this.markers.clearLayers();
            }
            
            var locations = [
            ];
            keys.map(item=>
            {
                var point =this.state.queryMap[item][0];
                locations.push([point.date,point.latitude, point.longitude]);
            });

            for (var i = 0; i < locations.length; i++) {
                var marker = new L.marker([locations[i][1],locations[i][2]])
                    .bindPopup(locations[i][0])
                    .addTo(this.markers);
            }
            this.markers.addTo(this.map);
        }
    }
    ,
    render()
    {   
        var size = Object.keys(this.state.queryMap).length;
        return(    
                <div id="map" style={{width: "100%", height:"350px"}}>
                </div>
            )
    }

});


