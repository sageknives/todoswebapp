
/**
 * Webapp overall Model
 */
function Model()
{
	this.dateTime;
	this.home;
	this.thisWeek = [];
	
	this.getHome = function()
	{
		return this.home;
	};
	this.addDueTodo = function(todo)
	{
		var weekOut = new Date();
		weekOut.setDate(weekOut.getDate() + 7);
		var weekBack = new Date();
		weekBack.setDate(weekBack.getDate() - 7);
		var t = todo.dueDate.split(/[- :]/);
		var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

		if (weekOut > d && weekBack < d){
		this.thisWeek.push(todo);
		}
	};
	this.getDueTodo = function()
	{
		 return this.thisWeek;
	};
	this.showDueTodos = function()
	{
		if(this.thisWeek.length < 1)return;
		var listItem = '';
		for(var i=0; i<this.thisWeek.length; i++){
			listItem = createLiItemHome(listItem,this.thisWeek[i],this.thisWeek[i].isCompleted());
		};
		$("#this-week").html(listItem);
	}
	this.setHome = function(node)
	{
		this.home = node;
		populateHome(node);
		this.setDateTime(); 
	};
	this.getDateTime = function()
	{
		return this.dateTime;
	}
	this.setDateTime = function()
	{
		this.dateTime = new Date().toMysqlFormat();
	}
	this.getHomeInstance = function()
	{
		if(this.home == null) this.getTree();
		else return this.home;
	};
	this.updateTree = function(todo)
	{
		var children = todo.getChildren();
		for(var i=0;i<children.length;i++)
		{
			children[i].getExtraInfo();
			this.updateTree(children[i])
		}
	};
	this.refreshTree = function(todo)
	{
		var children = todo.getChildren();
		for(var i=0;i<children.length;i++)
		{
			children[i].checkForUpdate();
			this.refreshTree(children[i])
		}
	}
	this.checkTreeForUpdates = function()
	{
		var model = this;
		var requestLink = "http://sagegatzke.com/todosajax/jsdirect.php?jsrequest=getnew&jstime="+this.dateTime;
		$.ajax({
			url : requestLink,
			dataType : "json",
			async:true,
			contentType: "application/json",
			success : function(result) {
				updateNewTodos(result,model.home);
				addNewTodos(result,model.home);
			}
		});
		this.setDateTime(); 
	}
	this.getTree = function()
	{
		var model = this;
		var requestLink = "http://sagegatzke.com/todosajax/jsdirect.php?jsrequest=getall";
		$.ajax({
			url : requestLink,
			dataType : "json",
			async:true,
			contentType: "application/json",
			beforeSend : function() {
				//$("#spinner").show();
			},
			success : function(result) {
				//$("#spinner").hide();
				var todoTree = createTree(result,model,0);
				createULS(todoTree,"top-element",true);
				model.setHome(todoTree);	
			}
		});
	};
}


/**
 * Todo Class
 */
function Todo(id,title,parentId,isComplete,dueDate,lastUpdated,parentNode)
{
	this.id = id;
	this.title = title;
	this.parentId = parentId;
	this.parentNode = parentNode;
	this.isComplete = isComplete;
	this.dueDate = dueDate;
	this.lastUpdated = lastUpdated;
	this.desc;
	this.assignedTo;
	this.createdBy;
	this.images = [];
	this.children = [];
	
	this.update = function(isComplete,dueDate,lastUpdated)
	{
		this.setCompleted(isComplete);
		this.dueDate = dueDate;
		this.lastUpdated = lastUpdated;
	};
	this.getId = function()
	{
		return this.id;
	};
	this.getTitle = function()
	{
		return this.title;
	};
	this.getParentId = function()
	{
		return this.parentId;
	};
	this.getParentNode = function()
	{
		return this.parentNode;
	};
	this.isCompleted = function()
	{
		return this.isComplete == 1;
	};
	this.setCompleted = function(isDone)
	{
		if(isDone == this.isComplete)return;
		this.isComplete = isDone;
		updateList(parentId,id,parentNode);
	};
	this.getDueDate = function()
	{
		return this.dueDate;
	};
	this.getLastUpdated = function()
	{
		return this.lastUpdated;
	};
	this.getDesc = function()
	{
		return this.desc;
	};
	this.setDesc = function(desc)
	{
		this.desc = desc;
	}
	this.addImage = function(src)
	{
		this.images.push(src);
	};
	this.getImages = function()
	{
		return this.images;
	}
	this.addChild = function(todo)
	{
		this.children.push(todo);
		if(home != null) updateList(this.id,todo.getId(),this);
	};
	this.getChildren = function()
	{
		var count = (this.children).length;
		if(count > 1)
		{
			 this.children = sortByDueDate(this.children);
			 this.children = sortByCompleted(this.children);
		}
		return this.children;
	};
	
	this.getExtraInfo = function()
	{
		var curTodo = this;
		
		var requestLink = "http://sagegatzke.com/todosajax/jsdirect.php?jsrequest=getextra&todoid=" + curTodo.id;
		$.ajax({
			url : requestLink,
			dataType : "json",
			async:true,
			contentType: "application/json",
			success : function(result) {
				if(result == null)return;
				curTodo.desc = result.desc;
				curTodo.createdBy = result.createdby;
				curTodo.assignedTo = result.assignedto;
				var imgs = result.images;
				for(var i=0;i< imgs.length; i++){
				  	curTodo.addImage(imgs[i]);
				};
			}
		});
	};
	
	
}

function updateNewTodos(result,node)
{
	
	for (var i=0; i < result.length; i++) {
	    if(node.id == result[i].id) {
	   		node.update(result[i].complete,result[i].duedate,result[i].lastupdated);
	   		remove(result,result[i]);
	    }
	}
	var children = node.getChildren();
	for (var i=0; i < children.length; i++) {
	   updateNewTodos(result,children[i]);
	}
};
function addNewTodos(result,node){
	if(result.length == 0) return;
	for (var i=0; i < result.length; i++) {
	    if(node.parentId == result[i].parent) {
	    	var parentNode = node.getParentNode();
	    	var child = new Todo(result[i].id,result[i].title,result[i].parent,result[i].iscomplete,result[i].duedate,result[i].lastupdated,parentNode);
	    	parentNode.addChild(child);
	   		remove(result,result[i]);
	    }
	}
	var children = node.getChildren();
	for (var i=0; i < children.length; i++) {
	   addNewTodos(result,children[i]);
	}
}

/**
 * creates the todo tree based on an ajax json response
 */
function createTree(json,model,parentNode)
{
	var item = new Todo(json.id,json.title,json.parent,json.complete,json.duedate,json.lastupdated,parentNode);
	if(!item.isCompleted()) model.addDueTodo(item);
	
	for(var i = 0; i < (json.children).length;i++) item.addChild(createTree(json.children[i],model,item));
	return item;
}

/**
 * Tests tree
 * @param {Object} item
 * @param {Object} titles
 * @param {Object} indent
 */
function testTree(item,titles,indent)
{
	titles.push(indent + item.title);
	for(var i = 0; i < (item.children).length;i++)
	{
		testTree(item.children[i],titles,indent + '&nbsp;&nbsp;&nbsp;&nbsp;');
	}
	return titles;
}
