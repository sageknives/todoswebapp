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

function updateList(id,childId,node)
{
	var model = getModel();
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
		updateList(parentNode.getId(),node.getId(),parentNode);
	}
	resetListeners();
};
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