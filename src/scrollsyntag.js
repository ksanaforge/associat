var React=require("react");
var kse=require("ksana-search");
var ScrollPagination = require("./scrollpagination").ScrollPagination;
var Page = require("./scrollpagination").ScrollPaginationPage;

var ScrollSyntag=React.createClass({
	getInitialState:function() {
		var pages=[];
		var segcount=this.props.db.get("meta").segcount;
		for (var i = 0; i < segcount; i++) {
			pages.push({
				id: i+1,
				data:null
				//items: pageItems("page-"+ (i+1))
			});
		}
		return {pages:pages};
	}
	,loadedPages:[]
	,componentDidMount:function(){
		this.loadNextPage();
	}
	,render: function () {
		return React.createElement(ScrollPagination, {
			ref: "scrollPagination",
			loadNextPage: this.loadNextPage,
			loadPrevPage: this.loadPrevPage,
			unloadPage: this.unloadPage,
			hasNextPage: this.hasNextPage,
			hasPrevPage: this.hasPrevPage,
		}, this.loadedPages.map(function (page, index) {
			var spans=page.data.map(function (item,idx) {
				return React.createElement('span', { key:'i'+idx,"data-vpos":item[1] }, item[0]);
			});

			spans.unshift(<span>{page.id}</span>);
			return React.createElement(Page, { key: page.id, id:page.id,
				onPageEvent: this.__handlePageEvent},spans	)
		}.bind(this)));
	},

	__handlePageEvent: function (pageId, event) {
		//console.log(this.loadedPages)
		this.refs.scrollPagination.handlePageEvent(pageId, event);
	},
	getPageText:function(pageId,cb,context) {
		kse.highlightSeg(this.props.db,0,pageId,{token:true},function(data){
			cb.call(context,data.text,data.segname);
		},this);
	}
	,hasNextPage : function () {
		var pages=this.state.pages;
		return  (this.loadedPages[this.loadedPages.length-1] !== pages[pages.length-1]) ;
	}
	,hasPrevPage : function () {
		var pages=this.state.pages;
		return (this.loadedPages[0] !== pages[0]);
	}
	,loadNextPage : function () {

		var pages=this.state.pages;
		var lastLoadedPage = this.loadedPages[this.loadedPages.length-1];
		var index = pages.indexOf(lastLoadedPage);
		var page = pages[index+1];
		if (!page) return false;

		this.getPageText(page.id,function(data,segname){
			setTimeout(function(){
				page.data=data;
				page.segname=segname;
				this.loadedPages.push(page);
				this.setState({hasNextPage: this.hasNextPage()});
			}.bind(this),1);
		},this);
		return true;//set loadingNextPage flag
	}
	,loadPrevPage : function () {
		var pages=this.state.pages;
		var firstLoadedPage = this.loadedPages[0];
		var index = pages.indexOf(firstLoadedPage);
		var page = pages[index-1];
		if (!page) return false;

		this.getPageText(page.id,function(data,segname){
			setTimeout(function(){
				page.data=data;
				page.segname=segname;
				this.loadedPages.unshift(page);
				this.setState({hasPrevPage: this.hasPrevPage()});
			}.bind(this),100);
		},this);
		return true;//set loadingPrevPage flag
	}
	,unloadPage : function (pageId) {
		var page = null;
		var index = null;
		for (var i = 0, len = this.loadedPages.length; i < len; i++) {
			if (this.loadedPages[i].id === pageId) {
				page = this.loadedPages[i];
				index = i;
				break;
			}
		}

		if (page === null) {
			throw new Error("Invalid attempt to unload page: "+ pageId +"\n"+ JSON.stringify(this.loadedPages.map(function (p) { return p.id; })));
		}

		this.loadedPages = this.loadedPages.slice(0, index).concat(this.loadedPages.slice(index+1, this.loadedPages.length));
		this.setState({	hasNextPage: this.hasNextPage(),	hasPrevPage: this.hasPrevPage()});
	}

})


module.exports=ScrollSyntag;