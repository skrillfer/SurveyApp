var ListBox = React.createClass({
    render() {
        return (
        <button type="button" className="list-group-item" id="product-list">
            <div className="row vertical-align">
                <div className="col-sm-8 top">
                    <h4>{this.props.row.ProductName}</h4>
                    <p> {this.props.row.QuantityPerUnit}</p>
                </div>
                <div className="col-sm-3 text-right top">
                    <h4>
                        {this.props.row.UnitPrice}
                        <small className="text-muted"> EUR</small>
                    </h4>
                    <p>{this.props.row.Discontinued ? "Discontinued" : "Available"}</p>
                </div>
                <div className="col-sm-1 center">
                    <span className="glyphicon glyphicon-chevron-right pull-right" aria-hidden="true"></span>
                </div>
            </div>
        </button>
    );
    }
    });