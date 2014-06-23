
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
				var foundTodos = [];
				foundTodos = updateNewTodos(result,model.home,foundTodos);
				var newTodos = [];
				for (var i=0; i < foundTodos.length; i++) 
				{
					if(foundTodos[i] == null) newTodos.push(result[i]);
				}
				addNewTodos(newTodos,model.home);
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
		this.updateList(parentId,id,parentNode);
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
		if(home != null) this.updateList(this.id,todo.getId(),this);
	};
	this.getChildren = function()
	{
		var count = (this.children).length;
		if(count > 1)
		{
			 this.children = this.sortByDueDate(this.children);
			 this.children = this.sortByCompleted(this.children);
		}
		return this.children;
	};
	
	this.sortByCompleted = function(list)
	{
		for ( var i=0; i < list.length; i++) 
		{
			for (var j=i+1; j < list.length; j++) 
			{ 
				if(this.boolToNum(list[i].isCompleted()) > this.boolToNum(list[j].isCompleted()))
				{
					var temp = list[i];
					list[i] = list[j];
					list[j] = temp;				
				}
			}
		}	
		return list;
	};
	
	this.sortByDueDate = function(list)
	{
		for ( var i=0; i < list.length; i++) 
		{
			for (var j=i+1; j < list.length; j++) 
			{ 
				if(list[j].title == null) continue;
				
				if(list[i].getDueDate() < list[j].getDueDate())
				{
					var temp = list[i];
					list[i] = list[j];
					list[j] = temp;				
				}
			}
		}	
		return list;
	};
	
	this.boolToNum = function(isTrue)
	{
		if(isTrue) return 1;
		return 0;
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
	
	this.updateList = function(id,childId,node)
	{
		var atTop = false;
		if(id == 1) {
			id = 'todo-nav';
			atTop = true;
		}
		var listItem = $('#list-' + id);
		var height = listItem.css("height");
		var marginLeft = listItem.css("margin-left");
		if(marginLeft == null) marginLeft = 0;
		if(listItem.length) 
		{
			listItem.remove();
		}
		else{
			var oldList = findOpenNav();
			oldId = oldList.substring(5);
			var oldListItem = $('#' + oldList);
			oldListItem.remove();
			var newNode = findTodo(oldId,model.home);
			createUl(newNode,"",false);
			setMenuId("#list-" + id);
		}
		createUl(node,"",atTop);
		listItem = $("#list-" + id);
		$(listItem).show();
		$(listItem).css("margin-left" ,marginLeft);
		$(listItem).css("height", height);
		var children = node.getChildren();
		var allDone = true;
		for(var i=0;i< children.length;i++)
		{
			if(!children[i].isCompleted()) 
			{
				allDone = false;
				break;
			}
		}
		if(allDone != node.isCompleted()) {
			updateTodoCompleted(node.getId(),allDone);
		}
		var parentNode = node.getParentNode();
		if(parentNode != '0')
		{
			parentNode.updateList(parentNode.getId(),this.getId(),parentNode);
		}
		
		resetListeners();
	};
}

function resetListeners()
{
	unsetListeners();
	addButtons();
}

function updateNewTodos(result,node,foundTodos)
{
	var found= false;
	for (var i=0; i < result.length; i++) {
	    if(node.id == result[i].id) {
	   		foundTodos[i] = true;
	   		node.update(result[i].complete,result[i].duedate,result[i].lastupdated);
	    }
	}
	
	/*if(!found){
		for (var i=0; i < result.length; i++) {
		  	//alert(node.getParentId() + ":" + result[i].parent);
		  	if(node.getParentId() == result[i].parent)
		  	{
	    	//alert("making a child");
	    	var parent = node.getParentNode();
	    	//id,title,parentId,isComplete,dueDate,lastUpdated,parentNode
	    	var child = new Todo(result[i].id,result[i].title,result[i].parent,result[i].iscomplete,result[i].duedate,result[i].lastupdated,parent);
	    	//parent.addChild(child);
	    	parent.updateList(parent.getId(),child.getId(),parent);
	    	}
		};
   
	}*/
	var children = node.getChildren();
	for (var i=0; i < children.length; i++) {
	   updateNewTodos(result,children[i],foundTodos);
	}
	return foundTodos;
};
function addNewTodos(newTodos,node){
	for (var i=0; i < newTodos.length; i++) {
	    if(node.getParentId() == newTodos[i].parent) {
	   		var parent = node.getParentNode();
	    	var child = new Todo(newTodos[i].id,newTodos[i].title,newTodos[i].parent,newTodos[i].iscomplete,newTodos[i].duedate,newTodos[i].lastupdated,parent);
	    	parent.addChild(child);
	    	parent.updateList(parent.getId(),child.getId(),parent);
	    	newTodos[i].parent = '';
	    }
	}
	var children = node.getChildren();
	for (var i=0; i < children.length; i++) {
	   addNewTodos(newTodos,children[i]);
	}
}
/**
 * Creates a list of views
 */
function makeList(todo, stepNum)
{
	var content = makeView(todo,'');
	var children = todo.getChildren();
	
	for (var i=0; i < children.length ; i++) { 
		content += makeView(children[i],(i+1));
	}
	return content;
}
/**
 * creates a view
 */
function makeView(todo, stepNum)
{
	var contentView = '';
	var checked = '';
	if(todo != null && todo.isCompleted()) checked = "checked";

	contentView += '<div id="view-' + todo.getId() +'"><h2 class="title">'+
	stepNum+". " +todo.getTitle()+'</h2><section class="col12 list-block background"><div class="li-obj">';

 	var images = todo.getImages();
	if(images.length > 0)
	{
		contentView += '<div class="li-obj-l col7"><img class="main-img" src="'+images[0]+'" /></div>';
	}		
	contentView +=	'<div class="li-obj-r col5"><header>';
	if(images.length > 1)
	{
		for (var i=0; i < images.length; i++) { 
			contentView += '<img src="'+images[i]+'" />';
		}
		contentView += '<br class="clear"/>';
	}
	contentView +=	'<p>'+todo.getDesc()+'</p></header></div><footer class="col5"><div class="obj-info col8">'+
		'<p>5 of 7</p><p>Complete</p></div><div class="obj-action col3"><label><input type="checkbox" '+
		checked+'>Mark As Done</label><p class="show-info" href="comments" id="'+stepNum+'">Comments/WorkLog</p></div>'+
			'</footer><br class="clear"/></div></section><div id="count'+stepNum+'">';
	//contentView += makeComments(todo);
	contentView += '</div></div><br class="clear">';
	return contentView;		
}

/**
 * creates comment section
 */
function makeComments(todo)
{
	var content = '<section class="obj-updates col12 background"><div class="obj-comments col7"><h3>Comments:</h3>'+
		'<p>4/16/2014</p><p>Tim</p><p>I think we should change the title of this to Sub subtitle?</p>'+
		'<textarea rows="4"></textarea></div><div class="obj-log col5"><h3>Notifications:</h3>'+
		'<h2 class="close">X</h2><p>SubTask1 finished by Tim on 4/14/2014</p></div></section>';	
	return content;
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
 * creates all Todo lists in model
 */
function createULS(node,firstelement,firstId)
{
	if(node.getChildren().length> 0)
	{
		var children = createUl(node,firstelement,firstId);
		for (var i=0; i < children.length; i++)createULS(children[i],firstelement,'');		
	}
}


/**
 * Creates a ul from a todo and its children
 */
function createUl(node,firstelement,firstId)
{
	var children = node.getChildren();
	var listItem = '';
	var ulId = node.getId();
	var h4Id = node.getParentId();
	if(firstId) {
		ulId = "todo-nav";
	}
	if(h4Id == 1) h4Id ='todo-nav';
	var parentTitle = node.getTitle();
	if(parentTitle.length > 20)parentTitle = parentTitle.substring(0,16) + "...";
	listItem += '<ul id="list-' + ulId + '" class="'+ firstelement +' top-nav-item todolist text-nav todolistnav"><h4 class="back-navigation" href="'+h4Id+'"><-'+parentTitle+'<img href="'+ulId+'" class="add-item nav-image" src="images/add.png"></h4>';
	firstelement = '';
	firstId = false;
	for (var i=0; i < children.length ; i++) {
		if(children[i].title == null) continue;
		var childTitle = children[i].getTitle();
		if(childTitle.length > 20)childTitle = childTitle.substring(0,20) + "...";
		if((children[i].getChildren()).length > 0)
		{
			var completed ='checked.png';
			var subChildren = children[i].getChildren();
			if(subChildren ==  null) break;
			for (var j=0; j < subChildren.length; j++) { 
				if(!subChildren[j].isCompleted()){
					completed ='blank.gif';
					break;
				} 
			}
			listItem = createLiItemList(listItem,children[i],completed);
		}
		else
		{
			var complete = '';
			if(children[i].isCompleted()) complete = 'checked';
			listItem = createLiItem(listItem,children[i],complete);
		}
	}
	listItem += '</ul>';
	$("#add-form-container").before(listItem);
	return children;
}

function createLiItemList(listItem,child,completed)
{
	listItem += '<li><img class="child-status nav-image" src="images/'+completed+
			'" /><p class="todo-navigation todo-nav-title" href="'+child.getId()+'">'+ child.getTitle() +
			 '</p><p class="atodo-nav-info"><a href="#todolist-'+child.getId()+"-"+child.getTitle() +
			  '"><img class="child-info nav-image" src="images/view.png" /></a></p></li>';
	return listItem;
}
/**
 * create li item
 */
function createLiItem(listItem,child,complete)
{
	listItem += '<li><input class="css-checkbox" type="checkbox" name="todo-item" value="'+
				child.getId()+'" '+complete+'><p class="todo-nav-title">'
				+'<a href="#todoview-'+child.getId()+"-"+ child.getTitle() + '">'+ child.getTitle() + 
				'</a></p><img href="'+child.getId()+
				'" class="add-sub-item child-status nav-image" src="images/addsub.png" />'+
				'<br class="clear" /></li>';
	return listItem;
}
/**
 * create li item
 */
function createLiItemHome(listItem,child,complete)
{
	listItem += '<li>'
				+'<a href="#todoview-'+child.getId()+"-"+ child.getTitle() + '">'+ child.getTitle() + 
				'</a></li>';
	return listItem;
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

function remove(arr, item) {
	for(var i = arr.length; i--;) if(arr[i] === item) arr.splice(i, 1); 
}
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
