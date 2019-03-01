var Mapa = React.createClass({
    getInitialState: function() {
        return {    
                    queryMap: this.props.queryMap, 
                    map : null,
                    markers : null,
                };
    },
    componentWillReceiveProps:function(nextprops) {
        var keys1 = Object.keys(this.state.queryMap);
        var keys2 = Object.keys(nextprops.queryMap);
        if (keys1 != keys2) {
            console.log('es diferente');
            if(this.map!=null)
            {
                
                //this.markers.removeLayer(markers);            
            }
        }
        /*try {
            this.map.clearLayers();
        } catch (error) {
            
        }*/
        this.setState({ queryMap: nextprops.queryMap });
    },

    componentDidMount:function()
    {
        //this.map = L.map('map');
        this.markers = L.layerGroup();
        console.log('=>componentDidMount');
    }
    ,
    componentDidUpdate: function()
    {
        console.log('*************************************');
        console.log('componentDidUpdate');    
        
        var keys = Object.keys(this.state.queryMap);
        console.log(keys.length);
        console.log('*************************************');
        if(keys.length>0)
        {

            var Xpoint = this.state.queryMap[keys[0]][0]; 
            
            if(this.map==null)
            {
                this.map = L.map('map').setView([Xpoint.latitude, Xpoint.longitude], 10);
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                    maxZoom: 18
                }).addTo(this.map);

                L.control.scale().addTo(this.map);
            
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
                console.log(point.date+"-"+point.latitude+"-"+point.longitude);
                locations.push([point.date,point.latitude, point.longitude]);
                
            });

            for (var i = 0; i < locations.length; i++) {
                var marker = new L.marker([locations[i][1],locations[i][2]])
                    .bindPopup(locations[i][0])
                    .addTo(this.markers);
                //markers.addLayer(marker);
            }
            
            this.markers.addTo(this.map);

        }    
    }
    ,

    render()
    {
        var keys = Object.keys(this.state.queryMap);
        console.log(keys.length);

        console.log('Mapa Renderizado');
        return(
            <div id="managerMap">
                
                {/* Mapa de calor */}
                    <div id="map" style={{width: "960px", height:"500px"}}></div>
            </div>
        )
    }
    
});