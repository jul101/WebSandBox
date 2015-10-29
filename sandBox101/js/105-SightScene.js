/**
 * Created by yc_lin on 2015/10/27.
 */
function SightScene(setting){
    if(setting){
        this.targetZone=setting.targetZone;
        this.width=setting.width;
        this.height=setting.height;
        this.step=setting.step;
        this.viewBox=setting.viewBox;
    }
    var targetZone;
    var targetZoneOffset;
    var width,height;
    var svg;
    var me=this;
    var step;
    var baseX,baseY;
    var strokeWidth,strokeWidthThin;
    var filterId="drop-shadow";
    var initial=function(){
        targetZone = me.targetZone;
        targetZoneOffset = $(targetZone).offset();
        width = me.width||500;
        height = me.height||500;
        step = me.step||100;
        strokeWidth = me.strokeWidth||2;
        strokeWidthThin = me.strokeWidthThin||1;
        baseX = me.baseX||50;
        baseY = me.baseY||50;
        svg = d3.select(targetZone)
            //.append("svg").attr("width", width).attr("height", height);
            .append("svg").attr(me);
        var createFilter=function(){
            // filters go in defs element
            var defs = svg.append("defs");
// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
            var filter = defs.append("filter")
                .attr("id", filterId)
                .attr("height", "130%");
// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3);
//                        .attr("result", "blur");
// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
            filter.append("feOffset")
//                        .attr("in", "blur")
                .attr("dx", 2)
                .attr("dy", 2)
                .attr("result", "offsetBlur");
// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode");
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");
        };
        createFilter();
    };
    initial();
    var colorGenerator=function(){
        var r, g,b;
        genRGB();
        var colorValMain="rgba("+r+", "+g+", "+b+", "+1+")";
        var colorValSub="rgba("+r+", "+g+", "+b+", "+0.5+")";

        function genColor(){
            var colVal=Math.ceil(Math.random()*255);
            return colVal;
        };

        function genRGB(){
            r=genColor();
            g=genColor();
            b=genColor();
            if((r+g+b)>500||(r+g+b)<100)genRGB();
        }

        return {
            colorValMain:colorValMain
            ,colorValSub:colorValSub
        };
    };
    var SceneNode=function(svg){
        //attrs
        var size=5;//圓圈尺寸
        var gap=3;  //圓圈之間的距離
        var x;
        var y;
        var textX;
        var textY;
        var fill;
        var text;
        var innerInfo;
        var outerInfo;
        var textInfo;
        this.isRoot=false;
        this.isEnd=false;
        this.colorValMain=this.colorValMain||"rgba(128, 0, 128,1)";
        this.colorValSub=this.colorValSub||"rgba(128, 0, 128,0.5)";
        this.isInit=false;
        var isNeedOutCircle=false;
        this.baseX=this.baseX||0;
        this.baseY=this.baseY||0;

        //Object Refs
        var d3Objs=[];
        var addNodeCircles=[];
        var innerCircle;
        var outerCircle;
        var textZone;
        this.additionNodeInfo=this.additionNodeInfo||[];
        this.addNodeInfo=function(info){
            this.additionNodeInfo.push(info);
        };
        var createAddNodes=function(drag){
            for (var i = 0; i < me.additionNodeInfo.length; i++) {
                var additionNode = me.additionNodeInfo[i];
                var info = {cx: x, cy: y,r:size+gap*(i+2)
                    ,id:me.id+i+"_addit"
                    ,class:"nodeAdd"
//                        ,fill:additionNode.colorValSub
                    ,fill:"none"
                    ,stroke:additionNode.colorValMain,'stroke-width':strokeWidthThin
                };
                var addNodeCircle = svg.append("circle").attr(info).call(drag);
                d3Objs.push(addNodeCircle);
                addNodeCircles.push(addNodeCircle);
            }

        };
        this.lineToNext=[];
        var me=this;
        this.setLineToNext=function(line){
            me.lineToNext.push(line);
        };
        //Ctrl Line Object
        this.prev=[];
        this.next=[];
        this.getPrev=function(){
            return this.prev;
        };
        this.setPrev=function(node){
            this.prev.push(node);
        };
        this.getNext=function(){
            return this.next;
        };
        this.setNext=function(node){
            this.next.push(node);
        };
        this.moveAbs=function(coords){
            me.x = coords.cx;
            me.y = coords.cy;
            innerCircle.attr(coords);
            outerCircle.attr(coords);
            textX = getTextX();
            textY = getTextY();
            textZone.attr({
                x:textX,y:textY
            });
            var lines=me.lineToNext;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line.attr({
                    points:getLinePoints(me,line.endNode)
                });
            }
            if(me.prev.length>0){
                var prevNodes=me.prev;
                for (var i = 0; i < prevNodes.length; i++) {
                    var prevNode = prevNodes[i];
                    var pNodeLines = prevNode.lineToNext;
                    if(pNodeLines.length==0) continue;
                    for (var j = 0; j < pNodeLines.length; j++) {
                        var line = pNodeLines[j];
                        if(line.endNode.id===me.id)
                            line.attr({
                                points:getLinePoints(line.startNode,me)
                            });
                    }
                }
            }
            //move add outside circle
            for (var i = 0; i < addNodeCircles.length; i++) {
                var addCircle = addNodeCircles[i];
                addCircle.attr(coords);
            }
        };
        function getTextX(){
            return me.x+size+gap*2;
        }
        function getTextY(){
            return me.y +size+2;
        }
        this.initFun=function(){
            if(me.isInit) {
                for (var i = 0; i < d3Objs.length; i++) {
                    var d3Obj = d3Objs[i];
                    d3Obj.remove();
                }
                d3Objs=[];
//                    return;
            }
            me.isInit=true;
            text = me.text;
            x = me.x || 0;
            y = me.y || 0;
            fill = me.fill || "";
            textX = getTextX();
            textY = getTextY();
            innerInfo = {cx: x, cy: y,r:size
                ,id:me.id+"_inner"
                ,class:"nodeIn"
//                    ,fill:"none"
                ,fill:me.colorValMain
//                    ,stroke:"rgba(128, 0, 128,1)",'stroke-width':strokeWidthThin
            };
            outerInfo = {cx: x, cy: y,r:size+gap
                ,id:me.id+"_outer"
                ,class:"nodeOut"
//                    ,fill:"white"
                ,fill:me.colorValSub
                ,stroke:me.colorValMain,'stroke-width':strokeWidthThin
            };
            textInfo = {
                x: textX, y: textY,"font-family": "sans-serif","font-size":"20px"
                ,class:"unselectable"
                ,id:me.id+"_text"
            };
            var drag = d3.behavior.drag();
            innerCircle = svg.append("circle").attr(innerInfo);
//                outerCircle = svg.append("circle").attr(outerInfo).style("filter", "url(#"+filterId+")");
            outerCircle = svg.append("circle").attr(outerInfo).call(drag);
            textZone = svg.append("text").attr(textInfo).text(text);
            drag.on("dragstart", function() {
                    //console.log('xy',me.x+","+me.y);
                    //console.log('xy',d3.event.sourceEvent.pageX+","+d3.event.sourceEvent.pageY);
                    //console.log('xy',d3.event.sourceEvent.clientX-me.baseX+","+d3.event.sourceEvent.clientY);
                    //console.log('me',me.x+','+me.y);
            });
            drag.on("drag", function() {
                d3.event.sourceEvent.stopPropagation(); // silence other listeners
                var eventX = d3.event.sourceEvent.clientX;
                var eventY = d3.event.sourceEvent.clientY;
                var offsetLeft=(me.baseX+this.parentNode.offsetLeft);
                var offsetTop=(me.baseY+this.parentNode.offsetTop);
                me.moveAbs({
                    //cx: d3.event.sourceEvent.pageX,cy:d3.event.sourceEvent.pageY
                    //cx: d3.event.sourceEvent.clientX,cy:d3.event.sourceEvent.clientY
                    cx: eventX-offsetLeft,cy:eventY-offsetTop
                });
            });
            d3Objs.push(innerCircle);
            d3Objs.push(outerCircle);
            d3Objs.push(textZone);
            if(isNeedOutCircle)createAddNodes(drag);
        };
//            initFun();
        return this;
    };
    var getLinePoints=function(fromNode,toNode){
        var coords=[];
        coords.push(fromNode.x+","+fromNode.y);
        coords.push(toNode.x+","+toNode.y);
        return coords.join(" ");
    };
    /**結合同一個路徑的節點**/
    var connectNode=function(root){
        var nextNodes=root.next;
        if(nextNodes&&nextNodes.length>0){
            for (var i = 0; i < nextNodes.length; i++) {
                var nextNode = nextNodes[i];
                console.log('root',root.colorValMain);
                var attrs={
                    points:getLinePoints(root,nextNode)
                    ,stroke:"rgba(128, 0, 128,1)"
//                        ,stroke:"rgba(128, 0, 128,1)"
                    ,"stroke-width":strokeWidth
                };
                var lineToNext=svg.append("polyline").attr(attrs);
                lineToNext.startNode=root;
                lineToNext.endNode=nextNode;
//                root.lineToNext=lineToNext;
                root.setLineToNext(lineToNext)
                connectNode(nextNode);
            }
        }
    };
    /**把相同名稱的節點結合在一起**/
    var mergeNodes=function(){
        //mergeNodePosition
        for(var key in sceneMap){
            var scenes=sceneMap[key];
            if(scenes.length>1){
                var sumX=0;
                var sumY=0;
                var newRy=0;
                var newRx=0;
                for (var i = 0; i < scenes.length; i++) {
                    var node = scenes[i];
                    newRy = node.y;
                    sumX+=parseInt(node.x);
                    sumY+=parseInt(node.y);
                }
                console.log('sumX',sumX+","+sumX/scenes.length);
                console.log('sumY',sumY+","+sumY/scenes.length);
                newRx = sumX/scenes.length;
                var newCoord={
                    cx:newRx,cy:newRy
                };
                for (var i = 0; i < scenes.length; i++) {
                    var node = scenes[i];
                    node.moveAbs(newCoord);
                }
            }
        }
    };
    var routeList=[];//紀錄執行過幾個路徑
    var sceneMap={};//保留相同名稱的節點，用以判斷是否需要合併
    this.createRoute = function(sceneAry){
        var sceneNodes=[];
        var tmpNode;
        var rootNode;
        var genColor=colorGenerator();
        var colorValMain=genColor.colorValMain;
        var colorValSub=genColor.colorValSub;
        for (var i = 0; i < sceneAry.length; i++) {
            var id =routeList.length+"_"+i;
            var sceneKey = sceneAry[i];
            var y = baseY + step * i;
            var x = baseX + 150 * routeList.length;
            var node=sceneMap[sceneKey];
            var nodeInfo={
                id: id, x: x, y: y, text: sceneKey
                ,baseX:targetZoneOffset.left
                ,baseY:targetZoneOffset.top
                ,colorValMain:colorValMain
                ,colorValSub:colorValSub
            };
            if(!node){
                node = SceneNode.apply(nodeInfo, [svg]);
                sceneMap[sceneKey] = node;
            }else{
                node.addNodeInfo(nodeInfo);
            }
            if(tmpNode){
                node.setPrev(tmpNode);
                tmpNode.setNext(node);
            }else{
                rootNode = node;
                node.isRoot=true;
            }
            sceneNodes.push(node);
            tmpNode=node;
        }
        tmpNode.isEnd=true;
        connectNode(rootNode);
        routeList.push(sceneNodes);
        refreshNodes();

        return sceneNodes;
    };
    var refreshNodes=function(){
        for (var i = 0; i < routeList.length; i++) {
            var route = routeList[i];
            for (var j = 0; j < route.length; j++) {
                var node = route[j];
                node.initFun();
            }
        }
    };
}
