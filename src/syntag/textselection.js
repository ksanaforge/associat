var getRange=function() {
  var sel = getSelection();
  if (!sel.rangeCount) return;
  var range = sel.getRangeAt(0);
  var s=range.startContainer.parentElement.parentElement;
  var e=range.endContainer.parentElement.parentElement;
  if (s.nodeName!='SPAN' || e.nodeName!='SPAN') return;
  var start=parseInt(s.getAttribute('data-vpos'),10);
  var end=parseInt(e.getAttribute('data-vpos'),10);
  var text="";
  var n=s;
  while (n) {
    text+=n.innerText;
    if (n==e) break;
    n=n.nextSibling;
  }
  return [start,end,text];
}
var getselection=function() {
  var R=getRange();
  if (!R) return;
  var start=R[0];
  var end=R[1];
  var length=0;
  var sel = getSelection();
  if (!sel.rangeCount) return;
  var range = sel.getRangeAt(0);
  var s=range.startContainer.parentElement.parentElement;
  var e=range.endContainer.parentElement.parentElement;
  var n=e.nextSibling,nextstart=0;
  var text=R[2];
  if (!n) return null;
  if (n.nodeName=="SPAN") {
    nextstart=parseInt(n.getAttribute('data-vpos'),10);
  }
  var selectionlength=end-start+sel.extentOffset-sel.anchorOffset;
  if (start+selectionlength==nextstart) {//select till end of last token
    length=selectionlength;
  } else {
    if (selectionlength)   length=nextstart-start; //https://github.com/ksanaforge/workshop/issues/50
    else length=end-start;
    //if (range.endOffset>range.startOffset &&!length) length=1;
    if (length<0) {
        var temp=end; end=start; start=end;
    }
  }

  //sel.empty();
 //this.refs.surface.getDOMNode().focus();
  return {start:start,len:length,text:text};
}

module.exports=getselection;
