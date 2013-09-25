function uid(e){for(var t=[],i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=i.length,o=0;e>o;++o)t.push(i[getRandomInt(0,n-1)]);return t.join("")}function getRandomInt(e,t){return Math.floor(Math.random()*(t-e+1))+e}function createAPIEnvoy(e){var t={serverURL:e,queuesForIntervals:{}};return t.request=function(e,t){var i=new XMLHttpRequest;i.open("POST",this.serverURL),i.setRequestHeader("Content-Type","application/json"),i.setRequestHeader("accept","application/json"),i.onload=function(){if(200===this.status){var e=JSON.parse(this.responseText);t(null,e)}else t(this.status,null)},i.send(JSON.stringify(e))},t.addRequestToQueue=function(e,t,i){var n=queuesForIntervals.toString(),o=null;n in this.queuesForIntervals?o=this.queuesForIntervals[n]:(o=[],this.queuesForIntervals[n]=o),o.push({jsonBody:t,done:i})},t}function OKCancelDialog(e,t,i,n,o){this.parentSelector=e,this.text=t,this.okText=i,this.respondToOK=n,this.cleanUpFunction=o}function createStore(){var e={apienvoy:createAPIEnvoy("http://192.241.250.38")};return e.saveSprigFromTreeNode=function(e,t){var i=null;if(e&&(i=D3SprigBridge.serializeTreedNode(e)),i){var n=TextStuff.makeId(4),o={};i.doc=t,o[n]={op:"saveSprig",params:i},this.apienvoy.request(o,function(e,t){return e?(console.log("Error while saving sprig:",e),void 0):(n in t&&"saved"===t[n].status?console.log("Sprig saved:",t):console.log("Sprig not saved."),void 0)})}},e.saveChildAndParentSprig=function(e,t){var i={};i.saveChildSprigOp={op:"saveSprig",params:e},i.saveParentSprigOp={op:"saveSprig",params:t},this.apienvoy.request(i,function(e,t){return e?(console.log("Error while saving sprigs:",e),void 0):(console.log("Child sprig save status:",t.saveChildSprigOp.status),console.log("Parent sprig save status:",t.saveParentSprigOp.status),void 0)})},e.deleteChildAndSaveParentSprig=function(e,t){var i={};i.deleteChildSprigOp={op:"deleteSprig",params:e},i.saveParentSprigOp={op:"saveSprig",params:t},this.apienvoy.request(i,function(e,t){return e?(console.log("Error while saving sprigs:",e),void 0):(console.log("Sprig deletion status:",t.deleteChildSprigOp.status),console.log("Parent sprig save status:",t.saveParentSprigOp.status),void 0)})},e.getSprigTree=function(e,t){var i={op:"getDoc",params:{id:e,childDepth:40}};this.apienvoy.request({getDocReq:i},function(e,i){return e?(t&&t(e,null),void 0):("getDocReq"in i&&"got"===i.getDocReq.status?t&&t(null,i.getDocReq.result.sprigTree):t&&t(null,null),void 0)})},e.createNewDoc=function(e,t){var i={},n="docCreateReq"+uid(4),o="rootSprigSaveReq"+uid(4);i[n]={op:"saveDoc",params:e},i[o]={op:"saveSprig",params:t},this.apienvoy.request(i,function(e,t){e?console.log("Error while saving doc:",e):console.log("Saved doc:",t)})},e}function createTreeNav(){var e={sprigTree:null,graphCamera:null,treeRenderer:null,graph:null,textStuff:null};return e.init=function(e,t,i,n,o){this.sprigTree=e,this.graphCamera=t,this.treeRenderer=i,this.graph=n,this.textStuff=o},e.chooseTreeNode=function(e,t){this.toggleChildren(e),this.graph.focusOnTreeNode(e,t),TextStuff.showTextpaneForTreeNode(e)},e.toggleChildren=function(e){e.children?(e._children=e.children,e.children=null):this.expandChildren(e)},e.expandChildren=function(e){e._children&&(e.children=e._children,e._children=null)},e.collapseRecursively=function(t){t.children&&(t._children=t.children,t._children.forEach(e.collapseRecursively),t.children=null)},e.nodeIsExpanded=function(e){return e.children&&!e._children},e.followBranchOfNode=function(e){var t=null;if("object"==typeof e.children)for(var i=e.children.length-1;i>=0&&(t=e.children[i],"boolean"!=typeof t.emphasized||!t.emphasized);--i);if(t){var n=d3.select("#"+t.id).node();this.chooseTreeNode(t,n)}},e.followParentOfNode=function(e){if("object"==typeof e.parent){var t=d3.select("#"+e.parent.id);this.chooseTreeNode(e.parent,t.node()),this.graphCamera.panToElement(t)}},e.moveToSiblingNode=function(e,t){if("object"==typeof e.parent&&"object"==typeof e.parent.children){var i=e.parent.children.indexOf(e),n=i+t;if(n>-1&&n<e.parent.children.length){var o=e.parent.children[n],r=d3.select("#"+o.id).node();o._children&&this.expandChildren(o),this.graph.focusOnTreeNode(o,r),this.textStuff.showTextpaneForTreeNode(o)}}},e.goToSprigId=function(e,t){var i=D3SprigBridge.mapPathToSprigId(e,this.sprigTree,100);i.length>1&&this.followPathToSprig(i,t)},e.followPathToSprig=function(e,t){if(!t)var t=this.treeRenderer.treeNodeAnimationDuration-200;e.forEach(function(e){this.expandChildren(e)}.bind(this)),this.treeRenderer.update(this.sprigTree,0),this.graph.focusOnSprig(e[e.length-1].id,t)},e.respondToDownArrow=function(){d3.event.stopPropagation(),this.nodeIsExpanded(this.graph.focusNode)?this.followBranchOfNode(this.graph.focusNode):this.chooseTreeNode(this.graph.focusNode,d3.select("#"+this.graph.focusNode.id).node())},e.respondToUpArrow=function(){d3.event.stopPropagation(),this.nodeIsExpanded(this.graph.focusNode)?(this.collapseRecursively(this.graph.focusNode),this.treeRenderer.update(this.graph.focusNode)):this.followParentOfNode(this.graph.focusNode)},e.respondToLeftArrow=function(){d3.event.stopPropagation(),this.moveToSiblingNode(this.graph.focusNode,-1)},e.respondToRightArrow=function(){d3.event.stopPropagation(),this.moveToSiblingNode(this.graph.focusNode,1)},e}function createGraph(){var e={camera:null,treeRenderer:null,treeNav:null,textStuff:null,historian:null,pane:null,board:null,svgRoot:null,focusEl:null,focusNode:null,nodeRoot:null};return e.init=function(e,t,i,n,o){return this.camera=t,this.treeRenderer=i,this.treeNav=createTreeNav(),this.textStuff=n,this.historian=o,this.pane=e.append("div").attr("id","graphPane").classed("pane",!0),this.board=this.pane.append("svg").attr({id:"svgBoard",width:"100%",height:"100%"}),this.board.append("g").attr("id","background").append("rect").attr({width:"100%",height:"100%",fill:"rgba(0, 0, 16, 0.2)"}),this.svgRoot=this.board.append("g").attr({id:"graphRoot",transform:"translate("+margin.left+","+margin.top+")"}),this.camera.setUpZoomOnBoard(this.board,this.svgRoot),this.setGraphScale(),this},e.loadNodeTreeToGraph=function(e,t,i){this.nodeRoot=e,this.treeRenderer.init(this.nodeRoot,this),this.treeNav.init(this.nodeRoot,Camera,TreeRenderer,this,this.textStuff);var n=this.board.node().clientHeight-margin.top-margin.bottom;this.nodeRoot.x0=n/2,this.nodeRoot.y0=0,this.treeNav.collapseRecursively(this.nodeRoot);var o=this.nodeRoot;this.treeRenderer.update(this.nodeRoot);var r=!0;if(t){var a=D3SprigBridge.mapPathInD3Tree(t,this.nodeRoot,100);a.length>0&&(this.treeNav.followPathToSprig(a),o=a[a.length-1],r=!1)}r&&setTimeout(function(){this.panToRoot(),this.focusNode&&Historian.syncURLToSprigId(this.focusNode.id)}.bind(this),800),setTimeout(function(){this.noteNodeWasVisited(o),this.textStuff.initialShow(o),i()}.bind(this),800)},e.panToRoot=function(){var e=d3.select("#"+this.nodeRoot.id);this.setFocusEl(e.node()),this.camera.panToElement(e)},e.setGraphScale=function(){var e=this.camera.getActualHeight(this.board.node());230>=e&&(this.camera.rootSelection.attr("transform","translate(0, 0) scale(0.5)"),this.camera.zoomBehavior.scale(.5))},e.setFocusEl=function(e){this.focusEl=e,this.focusNode=d3.select(this.focusEl).datum()},e.focusOnTreeNode=function(e,t){this.setFocusEl(t);var i=this.noteNodeWasVisited(e);i||this.noteNodeWasVisited(e),this.historian.syncURLToSprigId(e.id),this.treeRenderer.update(this.nodeRoot),Camera.panToElement(d3.select(this.focusEl))},e.focusOnSprig=function(e,t){t||(t=500);var i=d3.select("#"+e);setTimeout(function(){this.focusOnTreeNode(i.datum(),i.node())}.bind(this),t)},e.nodeHasFocus=function(e){return e===this.focusNode},e.noteNodeWasVisited=function(e){var t="visited_"+e.id;localStorage[t]=!0},e.nodeWasVisited=function(e){var t="visited_"+e.id;return t in localStorage},e.nodeIsUnvisited=function(e){return!this.nodeWasVisited(e)},e}var Camera={locked:!1,rootSelection:null,boardSelection:null,zoomBehavior:null,parsedPreLockTransform:null,setUpZoomOnBoard:function(e,t){var i=this.getActualWidth(e.node()),n=this.getActualHeight(e.node()),o=d3.scale.linear().domain([0,i]).range([0,i]),r=d3.scale.linear().domain([0,n]).range([n,0]);Camera.zoomBehavior=d3.behavior.zoom().x(o).y(r).scaleExtent([1,1]).on("zoom",Camera.syncZoomEventToTransform),Camera.boardSelection=e,Camera.boardSelection.call(Camera.zoomBehavior),Camera.rootSelection=t},syncZoomEventToTransform:function(){Camera.locked||Camera.rootSelection.attr("transform","translate("+d3.event.translate+")"+" scale("+d3.event.scale+")")},resetZoom:function(){Camera.locked||rootSelection.attr("transform","translate(0, 0) scale(1)")},lockZoomToDefault:function(){Camera.resetZoom(),Camera.locked=!0},lockZoom:function(){Camera.locked=!0},unlockZoom:function(){Camera.locked=!1,Camera.parsedPreLockTransform&&(Camera.tweenToNewZoom(Camera.parsedPreLockTransform.scale,Camera.parsedPreLockTransform.translate,300),Camera.parsedPreLockTransform=null)},lockZoomToDefaultCenterPanAtDataCoords:function(e){Camera.parsedPreLockTransform=Camera.parseScaleAndTranslateFromTransformString(Camera.rootSelection.attr("transform")),Camera.panToCenterOnRect(e),Camera.lockZoom()},panToCenterOnRect:function(e,t){t||(t=300);var i=this.getActualWidth(this.boardSelection.node()),n=this.getActualHeight(this.boardSelection.node()),o=1,r=Camera.rootSelection.attr("transform");if(r){var a=Camera.parseScaleAndTranslateFromTransformString(r);o=a.scale}Camera.tweenToNewZoom(o,[-e.x-e.width/2+i/2,-e.y-e.height/2+n/2],t)},tweenToNewZoom:function(e,t,i){var n=Camera.rootSelection.attr("transform");d3.transition().duration(i).tween("zoom",function(){var i=1,o=[0,0];if(n){var r=Camera.parseScaleAndTranslateFromTransformString(n);i=r.scale,o=r.translate}var a=d3.interpolate(i,e);return interpolateTranslation=d3.interpolate(o,t),function(e){var t=a(e);Camera.zoomBehavior.scale(t);var i=interpolateTranslation(e);Camera.zoomBehavior.translate(i),Camera.rootSelection.attr("transform","translate("+i[0]+", "+i[1]+")"+" scale("+t+")")}})},parseScaleAndTranslateFromTransformString:function(e){var t={scale:1,translate:[0,0]};if(e&&e.length>0){var i=e.split("scale(")[1];i&&(t.scale=parseFloat(i.substr(0,i.length-1)));var n=e.split(") ")[0].split(",");t.translate=[parseFloat(n[0].substr(10)),parseFloat(n[1])],t.translate[1]||console.log("Got NaN out of",n)}return t},getActualHeight:function(e){var t=e.clientHeight;return 1>t&&(t=e.parentNode.clientHeight),t},getActualWidth:function(e){var t=e.clientWidth;return 1>t&&(t=e.parentNode.clientWidth),t},translateYFromSel:function(e){return e.attr("transform").split(",")[1].split(".")[0]},translateXFromSel:function(e){return e.attr("transform").split(",")[0].split(".")[0].split("(")[1]},panToElement:function(e){var t=Camera.zoomBehavior.scale(),i=parseInt(Camera.translateYFromSel(e))*t,n=parseInt(Camera.translateXFromSel(e))*t;Camera.panToCenterOnRect({x:n,y:i,width:1,height:1},750)}};if("object"==typeof module)var _=require("underscore");D3SprigBridge={},D3SprigBridge.serializeTreedNode=function(e){var t=_.pick(e,"id","doc","title","body","emphasize"),i=e.children;return e.children||(i=e._children),i&&(t.children=_.pluck(i,"id")),t},D3SprigBridge.sanitizeTreeForD3=function e(t){if("object"==typeof t.children){for(var i=[],n=[],o=0;o<t.children.length;++o){var r=t.children[o];"object"==typeof r?n.push(r):i.push(r)}i.length>0&&(t.childRefs=i),n.length>0&&(t.children=n,t.children.forEach(e))}return t},D3SprigBridge.mapPathToSprigId=function(e,t,i){function n(t){return t.id===e}return this.mapPathInD3Tree(n,t,i)},D3SprigBridge.mapPathInD3Tree=function(e,t,i){if(e(t))return[t];for(var n=[],o={},r=null,a=0,s=null,d=[t];i>=a;){s=[];for(var l=0;l<d.length;++l){var c=d[l];if(e(c)){r=c;break}if(i>=a+1&&c){var h=[];"object"==typeof c.children&&c.children?h=c.children:"object"==typeof c._children&&c._children&&(h=c._children),h.forEach(function(e){o[e.id]=c}),s=s.concat(h)}}if(r)break;a++,d=s}if(r)for(var c=r;c;)n.unshift(c),c=c.id in o?o[c.id]:null;return n},"object"==typeof module&&(module.exports=D3SprigBridge),"object"==typeof module&&(module.exports.uid=uid),OKCancelDialog.prototype.show=function(){var e=d3.select(this.parentSelector).append("div").attr("id","OKCancelDialog").classed("notification",!0);e.append("p").attr("id","dialogText").text(this.text),e.append("button").attr("id","OKButton").text(this.okText?this.okText:"OK").on("click",this.respondToOKClick.bind(this)),e.append("button").attr("id","CancelButton").text("Cancel").on("click",this.respondToCancelClick.bind(this))},OKCancelDialog.prototype.respondToOKClick=function(){this.respondToOK(),this.cleanUpFunction&&this.cleanUpFunction(),d3.select(this.parentSelector).select("#OKCancelDialog").remove()},OKCancelDialog.prototype.respondToCancelClick=function(){this.cleanUpFunction&&this.cleanUpFunction(),d3.select(this.parentSelector).select("#OKCancelDialog").remove()};var TreeRenderer={treeLayout:null,diagonalProjection:null,sprigTree:null,graphSVGGroup:null,graph:null,treeNodeAnimationDuration:750};TreeRenderer.init=function(e,t){this.treeLayout=d3.layout.tree(),this.treeLayout.nodeSize([160,160]),this.sprigTree=e,this.diagonalProjection=d3.svg.diagonal().projection(function(e){return[e.y,e.x]}),this.graph=t,this.graphSVGGroup=t.svgRoot},TreeRenderer.update=function(e,t){t||(t=this.treeNodeAnimationDuration);var n=this.treeLayout.nodes(this.sprigTree).reverse();n.forEach(function(e){var t=e.x,i=e.x0;e.x=e.y,e.x0=e.y0,e.y=t,e.y0=i});var o=this.treeLayout.links(n);n.forEach(function(e){e.x=180*e.depth});var r=this.graphSVGGroup.selectAll("g.node").data(n,function(e){return e.id||(e.id=++i)}),a=r.enter().append("g").attr("class","node").attr("transform",function(){return"translate("+e.y0+","+e.x0+")"}).attr("id",function(e){return e.id}).on("click",TreeRenderer.respondToNodeClick);a.append("circle").attr("r",1e-6).style("fill",function(e){return e._children?"lightsteelblue":"#fff"}).style("fill-opacity",.7).style("stroke","rgba(0, 64, 192, 0.7)"),a.append("text").attr("x",function(e){return e.children||e._children?"0.3em":"-0.3em"}).attr("y","-1em").attr("dy",".35em").attr("text-anchor",function(e){return e.y>0?"start":"end"}).text(function(e){return e.title}).style("fill-opacity",1e-6);var s=r.transition().duration(t).attr("transform",function(e){return"translate("+e.y+","+e.x+")"});s.select("circle").attr("r",8).style("fill",function(e){var t="lightsteelblue";return this.graph.nodeHasFocus(e)?t="#e0362f":"boolean"==typeof e.emphasize&&e.emphasize&&(t="#08a"),t}.bind(this)).style("fill-opacity",function(e){var t=.7;return this.graph.nodeHasFocus(e)&&(t=1),t}.bind(this)).style("stroke-width",function(e){return e._children&&e._children.length>0?"1.4em":0}),s.select("text").style("fill-opacity",1);var d=r.exit().transition().duration(t).attr("transform",function(){return"translate("+e.y+","+e.x+")"}).remove();d.select("circle").attr("r",1e-6),d.select("text").style("fill-opacity",1e-6);var l=this.graphSVGGroup.selectAll("path.link").data(o,function(e){return e.target.id});l.enter().insert("path","g").attr("class","link").attr("d",function(){var t={x:e.x0,y:e.y0};return this.diagonalProjection({source:t,target:t})}.bind(this)),l.attr("d",this.diagonalProjection).attr("stroke-width",function(e){return this.graph.nodeWasVisited(e.target)?3:1.5}.bind(this)),l.exit().transition().duration(t).attr("d",function(){var t={x:e.x,y:e.y};return this.diagonalProjection({source:t,target:t})}.bind(this)).remove(),n.forEach(function(e){e.x0=e.x,e.y0=e.y})},TreeRenderer.respondToNodeClick=function(e){TreeRenderer.graph.treeNav.chooseTreeNode(e,this)};var TextStuff={graph:null,treeRenderer:null,store:null,sprigot:null,divider:null,pane:null,textpane:null,textcontent:null,titleField:null,contentZone:null,addButton:null,deleteButton:null,newSprigotButton:null,emphasizeCheckbox:null,findUnreadLink:null,downLink:null,OKCancelDialog:null,editAvailable:!1};TextStuff.init=function(e,t,i,n,o,r){this.graph=t,this.treeRenderer=i,this.store=n,this.sprigot=o,this.divider=r,this.pane=e.append("div").classed("pane",!0).attr("id","nongraphPane"),this.pane.append("div").attr("id","questionDialog"),this.textpane=this.pane.append("div").attr("id","textpane"),this.contentZone=this.textpane.append("div").classed("contentZone",!0).style("display","none"),this.titleField=this.contentZone.append("span").classed("sprigTitleField",!0).style("display","none"),this.textcontent=this.contentZone.append("div").classed("textcontent",!0).attr("tabindex",0),this.editAvailable&&(this.addButton=this.textpane.append("button").text("+").classed("newsprigbutton",!0).classed("editcontrol",!0),this.deleteButton=this.textpane.append("button").text("-").classed("deletesprigbutton",!0).classed("editcontrol",!0),this.textpane.append("label").text("Emphasize").classed("editcontrol",!0),this.emphasizeCheckbox=this.textpane.append("input").attr({type:"checkbox",id:"emphasize"}).classed("editcontrol",!0),this.newSprigotButton=this.textpane.append("button").text("New Sprigot!").classed("editcontrol",!0)),this.initFindUnreadLink(),d3.selectAll("#textpane .contentZone,.editcontrol").style("display","none"),this.editAvailable&&(this.textcontent.on("click",this.startEditing.bind(this)),this.titleField.on("click",this.startEditing.bind(this)),this.addButton.on("click",this.sprigot.respondToAddChildSprigCmd.bind(this.sprigot)),this.deleteButton.on("click",this.showDeleteSprigDialog.bind(this)),this.emphasizeCheckbox.on("change",this.respondToEmphasisCheckChange.bind(this)),this.contentZone.on("keydown",this.respondTocontentZoneKeyDown.bind(this)),this.newSprigotButton.on("click",this.sprigot.respondToNewSprigotCmd.bind(this.sprigot)))},TextStuff.initFindUnreadLink=function(){var e=location.hash.split("/");if(e.length>1){var t=e[0]+"/"+e[1]+"/";this.findUnreadLink=this.pane.append("a").attr("id","findunreadlink").attr("href",t+"findunread").classed("control-link",!0).classed("findunread-link",!0).text("Find Unread").style("display","none")}},TextStuff.syncTextpaneWithTreeNode=function(e){this.textcontent.datum(e),this.titleField.datum(e),this.textcontent.html(e.body),this.titleField.html(e.title),this.editAvailable&&(this.emphasizeCheckbox.node().checked=this.graph.focusNode.emphasize)},TextStuff.showTextpaneForTreeNode=function(e){this.syncTextpaneWithTreeNode(e),d3.selectAll("#textpane .contentZone,.editcontrol").style("display","block"),this.contentZone.style("display","block"),this.uncollapseTextpane()},TextStuff.fadeInTextPane=function(e){if("none"===this.contentZone.style("display")){var t=d3.selectAll("#textpane .contentZone,.editcontrol");this.textpane.style("opacity",0),t.style("opacity",0),this.contentZone.style("opacity",0),t.style("display","block").transition().duration(e).style("opacity",1),this.contentZone.style("display","block").transition().duration(e).style("opacity",1),this.textpane.transition().duration(e).style("opacity",1)}},TextStuff.fadeInControlLinks=function(e){var t=d3.selectAll("#nongraphPane .control-link");t.style("opacity",0),t.style("display","block").transition().duration(e).style("opacity",1)},TextStuff.initialShow=function(e){setTimeout(function(){this.syncTextpaneWithTreeNode(e),this.fadeInTextPane(750),this.fadeInControlLinks(800)}.bind(this),725)},TextStuff.uncollapseTextpane=function(){var e=this.pane.classed("collapsedPane");e&&this.divider.toggleGraphExpansion()},TextStuff.showTitle=function(){this.titleField.text(this.titleField.datum().title),this.titleField.style("display","block")},TextStuff.disableFindUnreadLink=function(){this.findUnreadLink.text("You've read all the sprigs!"),this.findUnreadLink.transition().duration(700).style("opacity",.3).style("cursor","default").attr("href",null),this.findUnreadLink.transition().delay(3e3).duration(2e3).style("opacity",0)},TextStuff.makeId=function(e){return"s"+uid(e)},TextStuff.changeEditMode=function(e,t){if(this.editAvailable)if(this.textcontent.attr("contenteditable",e),this.titleField.attr("contenteditable",e),this.contentZone.classed("editing",e),e)this.showTitle(),this.textcontent.node().focus();else{this.titleField.style("display","none");var i=this.textcontent.datum();i.body=this.textcontent.html();var n=this.titleField.text(),o=n!==i.title;i.title=n,o&&d3.select("#"+i.id+" text").text(i.title),this.textcontent.datum(i),this.titleField.datum(i),t||this.store.saveSprigFromTreeNode(this.textcontent.datum(),this.sprigot.docId)}},TextStuff.endEditing=function(){this.contentZone.classed("editing")&&this.changeEditMode(!1)},TextStuff.showDeleteSprigDialog=function(){this.OKCancelDialog=new OKCancelDialog("#questionDialog","Do you want to delete this?","Delete",this.sprigot.respondToDeleteSprigCmd.bind(this.sprigot),function(){delete this.OKCancelDialog}.bind(this)),this.OKCancelDialog.show()},TextStuff.respondToEmphasisCheckChange=function(){this.graph.focusNode&&(this.graph.focusNode.emphasize=this.emphasizeCheckbox.node().checked,this.treeRenderer.update(this.graph.nodeRoot),this.store.saveSprigFromTreeNode(this.graph.focusNode,this.sprigot.docId))},TextStuff.respondTocontentZoneKeyDown=function(){(d3.event.metaKey||d3.event.ctrlKey)&&13===d3.event.which&&(d3.event.stopPropagation(),this.contentZone.classed("editing")&&this.changeEditMode(!1))},TextStuff.startEditing=function(){d3.event.stopPropagation(),this.contentZone.classed("editing")||this.changeEditMode(!0)};var Divider={expanderArrow:null,graph:null,textStuff:null,camera:null};Divider.init=function(e,t,i,n){this.graph=t,this.textStuff=i,this.camera=n,this.expanderArrow=e.append("div").classed("divider",!0).append("svg").classed("arrowboard",!0).append("polygon").attr({id:"expanderArrow",fill:"rgba(0, 0, 64, 0.4)",stroke:"#E0EBFF","stroke-width":1,points:"0,0 32,24 0,48",transform:"translate(0, 0)"}),this.expanderArrow.on("click",this.toggleGraphExpansion.bind(this))},Divider.syncExpanderArrow=function(){var e=this.textStuff.pane.classed("collapsedPane"),t=e?36:6,i="translate("+t+", 0) ";i+="scale("+(e?"-1":"1")+", 1)",this.expanderArrow.transition().duration(500).ease("linear").attr("transform",i).attr("stroke-opacity",.5).attr("stroke-width",2).transition().delay(501).duration(500).attr("stroke-opacity",.15).attr("stroke-width",1)},Divider.toggleGraphExpansion=function(){var e=this.textStuff.pane.classed("collapsedPane"),t=!e;this.textStuff.pane.classed("collapsedPane",t).classed("pane",!t),this.graph.pane.classed("expandedPane",t).classed("pane",!t),this.textStuff.findUnreadLink.style("display",t?"none":"block"),this.syncExpanderArrow(),this.graph.focusEl&&this.camera.panToElement(d3.select(this.graph.focusEl))};var Historian={treeNav:null,docId:null};Historian.init=function(e,t){this.treeNav=e,this.docId=t,window.onpopstate=this.statePopped.bind(this)},Historian.statePopped=function(e){e.state&&(this.docId=e.state.docId,this.treeNav.goToSprigId(e.state.sprigId,100))},Historian.syncURLToSprigId=function(e){if("object"!=typeof window.history.state||!window.history.state||"string"!=typeof window.history.state.docId||"string"!=typeof window.history.state.sprigId||window.history.state.docId!==this.docId||window.history.state.sprigId!==e){var t=location.protocol+"//"+location.host+location.pathname+"#/"+this.docId+"/"+e;window.history.pushState({docId:this.docId,sprigId:e},null,t)}};var margin={top:20,right:10,bottom:20,left:10},Sprigot={docId:null,graph:null,store:null};Sprigot.init=function(e){var t=d3.select("body"),i=t.select(".sprigot");e&&!i.empty()&&i.remove(),i.empty()&&(i=t.append("section").classed("sprigot",!0),this.graph=createGraph(),this.graph.init(i,Camera,TreeRenderer,TextStuff,Historian),this.store=createStore(),Divider.init(i,this.graph,TextStuff,Camera),TextStuff.init(i,this.graph,TreeRenderer,this.store,this,Divider),Divider.syncExpanderArrow(),this.initDocEventResponders())},Sprigot.load=function(e,t,i){this.docId=e,Historian.init(this.graph.treeNav,this.docId),this.store.getSprigTree(e,function(e,n){if(e&&i(e,null),n){var o=D3SprigBridge.sanitizeTreeForD3(n);this.graph.loadNodeTreeToGraph(o,t,i)}else i("Sprig tree not found.")}.bind(this))},Sprigot.initDocEventResponders=function(){var e=d3.select(document);TextStuff.editAvailable&&e.on("click",TextStuff.endEditing.bind(TextStuff)),e.on("keyup",this.respondToDocKeyUp.bind(this)),e.on("keydown",this.respondToDocKeyDown.bind(this))},Sprigot.respondToDocKeyUp=function(){if(27===d3.event.keyCode)d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1);else if(!TextStuff.contentZone.classed("editing"))switch(d3.event.which){case 69:d3.event.stopPropagation(),"block"===TextStuff.contentZone.style("display")&&TextStuff.changeEditMode(!0);break;case 40:this.graph.treeNav.respondToDownArrow();break;case 38:this.graph.treeNav.respondToUpArrow();break;case 37:this.graph.treeNav.respondToLeftArrow();break;case 39:this.graph.treeNav.respondToRightArrow();break;case 187:d3.event.shiftKey&&this.respondToAddChildSprigCmd();break;case 85:this.respondToFindUnreadCmd()}},Sprigot.respondToDocKeyDown=function(){(d3.event.metaKey||d3.event.ctrlKey)&&8===d3.event.which&&TextStuff.showDeleteSprigDialog()},Sprigot.respondToAddChildSprigCmd=function(){d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1);var e={id:TextStuff.makeId(8),doc:this.docId,title:"New Sprig",body:""},t=this.graph.focusNode.children;t||(t=this.graph.focusNode._children),t||(t=[]),t.push(e),this.graph.focusNode.children=t,TextStuff.changeEditMode(!0),this.store.saveChildAndParentSprig(e,D3SprigBridge.serializeTreedNode(this.graph.focusNode)),TreeRenderer.update(this.graph.nodeRoot,settings.treeNodeAnimationDuration),setTimeout(function(){this.graph.focusOnSprig(e.id),TextStuff.showTextpaneForTreeNode(e)}.bind(this),settings.treeNodeAnimationDuration+100)},Sprigot.respondToDeleteSprigCmd=function(){d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1,!0);var e=this.graph.focusNode.parent,t=e.children.indexOf(this.graph.focusNode);e.children.splice(t,1);var i={id:this.graph.focusNode.id,doc:this.docId};this.store.deleteChildAndSaveParentSprig(i,D3SprigBridge.serializeTreedNode(e));var n=this.graph.treeNav;TreeRenderer.update(this.graph.nodeRoot,settings.treeNodeAnimationDuration),setTimeout(function(){n.chooseTreeNode(e,d3.select("#"+e.id).node())},settings.treeNodeAnimationDuration+500)},Sprigot.respondToNewSprigotCmd=function(){var e={id:uid(8),rootSprig:uid(8),authors:["deathmtn"],admins:["deathmtn"]},t={id:e.rootSprig,doc:e.id,title:"Root",body:"Hello. Type some stuff here.",children:[]};this.store.createNewDoc(e,t)},Sprigot.respondToFindUnreadCmd=function(){var e=D3SprigBridge.mapPathInD3Tree(this.graph.nodeIsUnvisited.bind(this.graph),this.graph.treeNav.sprigTree,100);if(e.length>0){(e.length>1||e[0].id!==this.graph.focusNode.id)&&this.graph.treeNav.followPathToSprig(e);var t=e[e.length-1];Historian.syncURLToSprigId(t.id),TextStuff.syncTextpaneWithTreeNode(t)}else TextStuff.disableFindUnreadLink()};var Director={};Director.direct=function(e){var t=e.split("/");if(t.length<2)return Sprigot.init(),Sprigot.load("About",this.matchAny),void 0;switch(t[1]){case"index":break;default:var i=t[1];if(t.length>1)var n=t[2];Sprigot.init();var o=function(e){return n===e.id};"findunread"===n&&(o=this.matchAny),Sprigot.graph.nodeRoot?"findunread"===n&&Sprigot.respondToFindUnreadCmd():Sprigot.load(i,o,function(e){e?console.log("Error while getting sprig:",e):"findunread"===n&&Sprigot.respondToFindUnreadCmd()})}},Director.matchAny=function(){return!0},Director.respondToHashChange=function(){this.direct(location.hash)},Director.init=function(){this.direct(location.hash),window.onhashchange=this.respondToHashChange.bind(this)},Director.init();