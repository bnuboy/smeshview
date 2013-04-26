var Topology = (function(){
	var _data;
	var _stage;
	var Topology = function(stage){
		_stage = stage;
		var nodeLine = {};//存放点线关系
		var nodes    = {};//存放节点信息,hash表
		var _node    = [];//存放节点信息,数组
		this.setData = function(data){
			_data = data;
		};
		this.createTopology = function(){
	        var shape = new createjs.Shape();
	        createjs.Ticker.setFPS(20);
	        createjs.Ticker.addListener(function(){
	            _stage.update();
	        });
	        for(var i = 0;i < _data.length; i ++){
	        	var o = _data[i];
	        	var node = new Node(_stage,o.x,o.y,50,50,10,"#FFff00","#999999",o.id,o.parent,o.info);
	        	nodes[node.getId()] = node;
	        	_node.push(node);
	        }
	        for (var i = 0; i < _node.length; i ++) {
	        	var n = _node[i];
	    		if(typeof(nodeLine[n.getId()]) == "undefined"){
	    			nodeLine[n.getId()] = [];
	    		}
	        	if(n.getId() != 0){
	        		var p = nodes[n.getParent()];
	        		if(typeof(nodeLine[p.getId()]) == "undefined"){
	        			nodeLine[p.getId()] = [];
	        		}
	        		var line = new Line(stage,"#ff0000");
	        		line.setStartPoint(p.getX(),p.getY());
	        		line.setEndPoint(n.getX(),n.getY());
	        		line.drawLine();
	        		nodeLine[n.getId()].push({head:0,line:line});
	        		nodeLine[p.getId()].push({head:1,line:line});
	        	}
	        	n.addClickHandler(function(tempNode){
	        		console.log(tempNode);
	        	});
	        	n.addMoveHandler(function(tempNode){
	        		var id = tempNode.getId();
	        		var ls = nodeLine[id];
	        		for(var i = 0; i < ls.length; i ++){
	        			var l = ls[i].line;
	        			if(ls[i].head == 0){
	        				l.redraw(l.getX1(),l.getY1(),tempNode.getX(),tempNode.getY());
	        			}else{
	        				l.redraw(tempNode.getX(),tempNode.getY(),l.getX2(),l.getY2());
	        			}
	        		}
	        	});
	        };
		};
		this.showData = function(){
			var data = [];
			for(var i = 0; i < _node.length; i ++){
				var n = _node[i];
				var o = {id:n.getId(),parent:n.getParent(),x:n.getX(),y:n.getY(),info:n.getInfo()};
				data.push(o);
			}
			return data;
		}
	}
	return Topology;
})();
var Line = (function(){
	var Line = function(stage,lineColor){
		this.stage = stage;
		this.lineColor = lineColor;
		this.shape = new createjs.Shape();
		if(!this.stage.contains(this.container)){
			this.stage.addChildAt(this.container,0);
		}
	};
	Line.prototype.drawLine = function(){
			// var shape = new createjs.Shape();
			this.shape.graphics.ss(2).s(this.lineColor).mt(this.x1,this.y1).lt(this.x2,this.y2);
			this.container.addChild(this.shape);
		};
	Line.prototype.container = new createjs.Container();
	Line.prototype.setStartPoint = function(x1,y1){
		this.x1 = x1;
		this.y1 = y1;
	}
	Line.prototype.setEndPoint = function(x2,y2){
		this.x2 = x2;
		this.y2 = y2;
	}
	Line.prototype.getX1 = function(){
		return this.x1;
	}
	Line.prototype.getY1 = function(){
		return this.y1;
	}
	Line.prototype.getX2 = function(){
		return this.x2;
	}
	Line.prototype.getY2 = function(){
		return this.y2;
	}
	Line.prototype.getStartPoint = function(){
		return {x:this.x1,y:this.y1};
	}
	Line.prototype.getEndPoint = function(){
		return {x:this.x2,y:this.y2};
	}
	Line.prototype.redraw = function(x1,y1,x2,y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		$this = this;
		this.shape.graphics.c().ss(2).s($this.lineColor).mt($this.x1,$this.y1).lt($this.x2,$this.y2);
	}
	return Line;
})();
var Node = (function(){
	var Node = function(stage,x,y,width,height,radius,bgColor,borderColor,no,parent,info){
		var moveHandler = [];
		var clickHandler = [];
		var _stage = stage;
		this.x = x;
		this.y = y;
		this.id = no;
		this.parent = parent;
		this.info = info;
		this.node = drawPoint(x,y,width,height,radius,bgColor,borderColor,no);
		this.container.addChild(this.node);
		var that = this;
		if(!stage.contains(this.container)){
			stage.addChild(this.container);
		}
		this.addMoveHandler = function(func){
			moveHandler.push(func);
		};
		this.addClickHandler = function(func){
			clickHandler.push(func);
		}
		function drawPoint(x,y,width,height,radius,bgColor,borderColor,no){
			var singleContainer = new createjs.Container();
			var Point = new createjs.Point;
			var shape = new createjs.Shape();
			var text;
			if(no < 10){
				text  = new createjs.Text(no, "36px Arial", "#FFF");
				text.x    = x + 15;
				text.y    = y + 10;
			}else if(no < 100){
				text  = new createjs.Text(no, "30px Arial", "#FFF");
				text.x    = x + 8;
				text.y    = y + 12;
			}else{
				text  = new createjs.Text(no, "28px Arial", "#FFF");
				text.x    = x;
				text.y    = y + 12;
			}
			shape.graphics.ss(5).s(borderColor).f(bgColor).rr(x,y,width,height,radius);
			singleContainer.regX = x + width / 2;
			singleContainer.regY = y + height / 2;
			singleContainer.x = x;
			singleContainer.y = y;
			singleContainer.addChild(shape,text);
			singleContainer.addEventListener("click",function(evt){
				for (var i = clickHandler.length - 1; i >= 0; i--) {
					clickHandler[i](that);
				};
			});
			singleContainer.addEventListener("mousedown",function(evt){
				var o = evt.target;
				o.parent.addChild(o);
				var offset = {x:o.x - evt.stageX,y:o.y - evt.stageY};
				var evto = evt;
				evt.addEventListener("mousemove",function(evt){
					o.x = evt.stageX + offset.x;
					o.y = evt.stageY + offset.y;
					that.x = o.x;
					that.y = o.y;
					for(var i = 0; i < moveHandler.length; i ++){
						moveHandler[i](that);
					}
				});
				evt.addEventListener("mouseup",function(evt){
					//alert("up");
				});
			});
			return singleContainer;
		}
	}
	Node.prototype.getX = function(){
		return this.x;
	}
	Node.prototype.getY = function(){
		return this.y;
	}
	Node.prototype.getPosition = function(){
		return {x:this.x,y:this.y};
	}
	Node.prototype.getId = function(){
		return this.id;
	}
	Node.prototype.getParent = function(){
		return this.parent;
	}
	Node.prototype.getInfo = function(){
		return this.info;
	}
	Node.prototype.container = new createjs.Container();
	Node.prototype.addChild = function(child){
		Node.prototype.container.addChild(child);
	}
	return Node;
})();