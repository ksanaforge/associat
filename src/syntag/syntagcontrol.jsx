var React=require("react");
var action_dataview=require("../actions/dataview");
var SyntagControl=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,dbkey:React.PropTypes.string.isRequired
	}
	,close:function() {
		action_dataview.close(this.props.dbkey);
	}
	,render:function(){
		return <span>controls
			<a href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</a>
		</span>
	}
});

module.exports=SyntagControl;