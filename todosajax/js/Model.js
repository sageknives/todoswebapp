function Model()
{
	this.home;
	
	this.getHome = function()
	{
		return this.home;
	}
	
	this.setHome = function(node)
	{
		this.home = node;
		populateHome(node);
	}
	this.getHomeInstance = function()
	{
		if(this.home == null)
		{
			this.getTree();
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
				//unsetListeners();
				
				
				var stringify = JSON.stringify(result);
				var todoTree = createTree(result);
				//$("#content").html(stringify);
				//var titles = [];
				//var indent = '';
				//titles = testTree(result,titles,indent);
				//var content = '';
				//for(var i=0;i< titles.length;i++)
				//{
				//  content += titles[i] + '<br>';
				//}
				//alert(todoTree.isCompleted());
				createULS(todoTree,"top-element",true);
				//this.home = todoTree;
				model.setHome(todoTree);
				
				
			}
		});
	};
}

function testTree(item,titles,indent)
{
	//if(item.title === undefined) return;
	titles.push(indent + item.title);
	for(var i = 0; i < (item.children).length;i++)
	{
		//titles += item.children[i].title + '<br>';
		//if((item.children[i]).length == 0) continue;
		testTree(item.children[i],titles,indent + '&nbsp;&nbsp;&nbsp;&nbsp;');
	}
	return titles;
}
function createTree(json)
{
	var item = new Todo(json.id,json.title,json.parent,json.complete);
	
	for(var i = 0; i < (json.children).length;i++)
	{
		item.addChild(createTree(json.children[i]));
	}
	return item;
}

function createULS(node,firstelement,firstId)
{
	
	
	if(node.getChildren().length> 0)
	{
		var children = createUl(node,firstelement,firstId);
		for (var i=0; i < children.length; i++) { 
			createULS(children[i],firstelement,'');
		}
		
	}
	//echo '</li>';
}

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

function createLi()
{
	
}

function Todo(id,title,parent,isComplete)
{
	this.id = id;
	this.title = title;
	this.parent = parent;
	this.isComplete = isComplete;
	this.children = [];
	/*function(){
		var arr = [];
		for(var child in children)
		{
			arr = new Todo(child.id,child.title,child.parent,child.complete,child.children);
		}
		return arr;
	};*/
	
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
	this.addChild = function(todo)
	{
		this.children.push(todo);
	};
	this.getChildren = function()
	{
		var count = (this.children).length;
		//alert("Children count = " + count);
		if(count > 1) this.children = this.sortByCompleted(this.children);
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
	
	this.boolToNum = function(isTrue)
	{
		if(isTrue) return 1;
		return 0;
	};
	
	this.updateList = function(id,childId,node)
	{
		alert("parent:" + id + ", child:" + childId);
		var listItem = $('#list-' + id);
		alert(listItem.length);
		var height = listItem.css("height");
		if(listItem.length) 
		{
			listItem.remove();
			

		}
		else{
			alert("not created");
			closeNavs();
			setMenuId("#list-" + id);
		}
		createUl(node,"",false);
		listItem = $("#list-" + id);
		$(listItem).show();
		$(listItem).css("margin-left" ,"0");
		$(listItem).css("height", height);
		unsetListeners();
		addButtons();
	}
}



