/*
  relations in memory, sync access.
  prefetch from (pouchdb) async
*/

var Reflux=require("reflux");
var actions=require("../actions/relation");
var relations={
	145153:[{caption:"18段"}]
	,516:[{caption:"引用"}]
	,1024:[{caption:"R4"},"aaa",517,"bb"]
	,517:[{caption:"引用2"}]
	,768:[{caption:"R3"},"xxxx",1024,"qqqq"]
	,256: [ {caption:"R2"} ,"c1", 516, "c2", 768]
	,512: [{caption:"R1"} ,"b1", 256 , "b2",256]
};


var store_relation=Reflux.createStore({
	listenables:actions
	,onSetVisibleRange:function(db,fromvpos,tovpos) {
		var out=[],c=0;
		var i=fromvpos;
		while (i<tovpos){
			var length=Math.floor(Math.random()*5)+1;
			var offset=i*256;
			out.push([offset, offset+length*256, {caption:"m"+c}] );
			c++;
			skip=Math.floor(Math.random()*100);
			i+=skip;
		}
		this.trigger(db,out);
	}
})
module.exports=store_relation;
