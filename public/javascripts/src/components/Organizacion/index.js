'use strict';

const e = React.createElement;

class OrgsPage extends React.Component {
  constructor(props) {
    super(props);
    this.NumRespuestas = this.NumRespuestas.bind(this);
    this.state = {
      loading: false,
      orgs: [],
      headers : [],
      userKey: UserID,
    };
  }

  componentDidMount() {
    const { orgs, loading } = this.state;
    console.log('KEY:'+this.state.userKey);
    this.setState({ orgs:[],loading: true });

    this.firebaseRef = db.ref('proyectos/');
    
    var current = this;
    db.ref('usuarios/'+this.state.userKey+'/organizaciones').on('value', snapshot => {
        current.setState({ 
          orgs: []
        });
        current.setState({ 
          orgs: current.state.orgs[current.state.userKey]=([])
        })
        snapshot.forEach(function(childSnapshot) {
          var orgKey = childSnapshot.key;
          

          db.ref('proyectos/'+orgKey).on('value',childSnapshot =>{

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            

            if(childSnapshot.hasChild('encuestas'))
            {
                db.ref('proyectos/'+childKey+'/encuestas').on('value', xsnapshot => {
                  if(xsnapshot.exists())
                  {
                    
                    const usersObject = xsnapshot.val();

                    const ARRAY2=Object.keys(usersObject).map(key => ({
                      ...usersObject[key],
                      uid: key,
                      organizacion: childData.nombre,
                      idorg: childKey,
                    }));
                    
                    
                    var HashTmp = current.state.orgs;
                    HashTmp[childKey] = ARRAY2;
                    current.setState({ 
                      orgs: HashTmp,
                      loading:false
                    });
                  }
                    
                });
            }
          });
          
        });
    }
    
    );

    

  }


  NumRespuestas(keyorg,keyencu)
  {
    var tam = "";
    db.ref('proyectos/'+keyorg+'/respuestas/'+keyencu).on('value', xsnapshot =>{
        tam = xsnapshot.numChildren();
    });
    return tam;
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }
   
 
  render() {
    const { orgs, loading } = this.state;
    console.log('----------------');
    console.log(orgs);
    //console.log(Object.keys(orgs));


    return (
      
      <div>
        {loading && <div style ={{display: 'block'}}  className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" style={{width: "5rem", height: "5rem"}} role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
        {!loading ?
          <div>
          <h1>Encuestas</h1>
          <OrgSList orgs={orgs} NumRespuestas = {this.NumRespuestas}/>  
          </div>: null
        }
        
      </div>
     );
    
 
  }
}







const OrgSList = ({ orgs,NumRespuestas }) => (

  <div className="animated fadeIn">
      <div className ="row">
      {
        Object.keys(orgs).map( key => 

          (
              orgs[key].map(
                item =>
                
                <div key={key+"-"+item.uid} className ="col-sm-3 col-md-3">

                    <div className ="card">
                      <div className ="card-header">
                          <a href="#"><span className="glyphicon glyphicon-globe"></span></a>&nbsp;
                          {item.organizacion}
                          <div class="card-header-actions">
                            <a href="#" id={'dropdownMenuButton'+item.uid} class="card-header-action btn-setting dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="icon-settings"></i>
                            </a>
                            <div class="dropdown-menu popup1" aria-labelledby={'dropdownMenuButton'+item.uid} x-placement="bottom-start">
                              <a class="dropdown-item" href="#">Compartir</a>
                            </div>
                          </div>
                      </div>

                      <div className ="card-body">
                        <div className="row">
                            
                            <div className = "col-sm-8">
                              <div className="centerBlock">
                              <a href={'/dashboard/encuesta/'+key+'/'+item.uid} >{item.nombre}</a>
                              </div>
                            </div>
                            <div className = "col-sm-8">
                              <div className = "callout callout-info">
                                  <small className = "text-muted">Respuestas</small>
                                  <br/>
                                  <strong className = "h4">{NumRespuestas(key,item.uid)}</strong>
                              </div>
                            </div>
                        </div>   
                      </div>
                    </div>
                </div>

              )
          )
        )
      }
      </div>
  </div>
  /*
  <table id="customers">
    <thead>
        <tr>
          <th>Organizacion</th>
          <th>Encuesta</th>     
        </tr>
    </thead>
    
    <tbody>
      {Object.keys(orgs).map( key => ( 
          orgs[key].map(
              item =>
              ( <tr key={key+item.uid}>
                  <td ket = {key+item.uid}>
                  {item.organizacion}
                  </td>
                  <td>
                    <a href={'/dashboard/encuesta/'+key+'/'+item.uid} >{item.nombre}</a>
                  </td>
                </tr>
              )
          ) 
      ))}
    </tbody>

  </table>*/
);


const domContainer = document.querySelector('#container');
ReactDOM.render(e(OrgsPage),domContainer);

