/**
 * Webapp overall Model
 */
function Model()
{
	this.home;
	
	this.getHome = function()
	{
		return this.home;
	};
	this.setHome = function(node)
	{
		this.home = node;
		populateHome(node);
	};
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
				//var stringify = JSON.stringify(result);
				var todoTree = createTree(result);

				createULS(todoTree,"top-element",true);
				model.setHome(todoTree);	
			}
		});
	};
}


/**
 * Todo Class
 */
function Todo(id,title,parent,isComplete,dueDate,lastUpdated)
{
	this.id = id;
	this.title = title;
	this.parent = parent;
	this.isComplete = isComplete;
	this.dueDate = dueDate;
	this.lastUpdated = lastUpdated;
	this.desc;
	this.assignedTo;
	this.createdBy;
	this.images = [];
	this.children = [];
	
	this.getId = function()
	{
		return this.id;
	};
	this.getTitle = function()
	{
		return this.title;
	};
	this.getParent = function()
	{
		return this.parent;
	};
	this.isCompleted = function()
	{
		return this.isComplete == 1;
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
				if(list[j].title == null) continue;
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
			beforeSend : function() {
				//$("#spinner").show();
			},
			success : function(result) {
				if(result == null)return;
				//alert(curTodo.id);
				curTodo.desc = result.desc;
				curTodo.createdBy = result.createdby;
				curTodo.assignedTo = result.assignedto;
				var imgs = result.images;
				for(var i=0;i< imgs.length; i++){
				  	curTodo.addImage(imgs[i]);
				};
				//curTodo.images = result.images;
				//alert(curTodo.desc);
				//$("#spinner").hide();
				//var stringify = JSON.stringify(result);
				//alert(stringify);
				//var todoTree = createTree(result);

				//createULS(todoTree,"top-element",true);
				//model.setHome(todoTree);	
			}
		});
	};
	
	this.checkForUpdate = function()
	{
		var curTodo = this;
		alert(curTodo.id);
		var requestLink = "http://sagegatzke.com/todosajax/jsdirect.php?jsrequest=checkforupdate&todoid=" + curTodo.id+"&todolast="+curTodo.lastUpdated;
		$.ajax({
			url : requestLink,
			dataType : "json",
			async:true,
			contentType: "application/json",
			beforeSend : function() {
				//$("#spinner").show();
			},
			success : function(result) {
				if(result == null)return;
				//$("#spinner").hide();
				//var stringify = JSON.stringify(result);
				//var todoTree = createTree(result);
				
				//createULS(todoTree,"top-element",true);
				//model.setHome(todoTree);	
			}
		});
	};
	
	this.updateList = function(id,childId,node)
	{
		var listItem = $('#list-' + id);
		var height = listItem.css("height");
		if(listItem.length) 
		{
			listItem.remove();
		}
		else{
			var oldList = findOpenNav();
			oldId = oldList.substring(5);
			var oldListItem = $('#' + oldList);
			oldListItem.remove();
			var newNode = findTodo(oldId,home);
			createUl(newNode,"",false);
			setMenuId("#list-" + id);
		}
		createUl(node,"",false);
		listItem = $("#list-" + id);
		$(listItem).show();
		$(listItem).css("margin-left" ,"0");
		$(listItem).css("height", height);
		unsetListeners();
		addButtons();
	};

	//this.setDesc = function()
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
	stepNum+todo.getTitle()+'</h2><section class="col12 list-block background"><div class="li-obj">';

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
function createTree(json)
{
	var item = new Todo(json.id,json.title,json.parent,json.complete,json.duedate,json.lastupdated);
	for(var i = 0; i < (json.children).length;i++) item.addChild(createTree(json.children[i]));
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
	var h4Id = node.getParent();
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
			listItem += '<li><img class="child-status nav-image" src="images/'+completed+
			'" /><p class="todo-navigation todo-nav-title" href="'+children[i].getId()+'">'+ childTitle +
			 '</p><p class="atodo-nav-info"><a href="#todolist-'+children[i].getId()+"-"+children[i].getTitle() +
			  '"><img class="child-info nav-image" src="images/view.png" /></a></p></li>';
		}
		else
		{
			var complete = '';
			if(children[i].isCompleted()) complete = 'checked';
			listItem += '<li><input class="css-checkbox" type="checkbox" name="todo-item" value="'+
				children[i].getId()+'" '+complete+'><p class="todo-nav-title">'
				+'<a href="#todoview-'+children[i].getId()+"-"+ children[i].getTitle() + '">'+ childTitle + 
				'</a></p><img href="'+children[i].getId()+
				'" class="add-sub-item child-status nav-image" src="images/addsub.png" />'+
				'<br class="clear" /></li>';
		}
	}
	listItem += '</ul>';
	$("#add-form-container").before(listItem);
	return children;
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
