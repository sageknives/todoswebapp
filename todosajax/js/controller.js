var xmlhttp;
var content;
var d = new Date();
var currentMenuId = '';
var model = new Model();
model.getHomeInstance();
var home;

if(window.XMLHttpRequest) {
	xmlhttp = new XMLHttpRequest();
} else {
	xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
}
function upDateTodoLists(parentId,id,title,desc,dueDate)
{
	ulId = "#list-" + parentId;
	if($(ulId) != null){
		var parentNode = findTodo(parentId,model.home);
		var child = new Todo(id,title,parentId,false,dueDate,new Date().toMysqlFormat(),parentNode);
		child.setDesc(desc);
		parentNode.addChild(child);
		updateList(parentId,id, parentNode);
		resetListeners();
	} 
	else alert(ulId +": it's null!");	
}

//add form
function addTodo(parentId)
{
	if(parentId == "todo-nav") parentId = 0;
	if($("#todo-name").val() == '')
	{
		$("#invalid-todo").show();
		return;
	}
	else{
		$("#invalid-todo").hide();
	}
	var todoTitle = $("#todo-name").val();
	var todoDesc = $("#todo-desc").val();
	var dueDate = $("#todo-date").val() + " 12:00:00";
	
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?treeId=" + parentId + 
	'&name=' + $("#todo-name").val() + '&info=' + $("#todo-desc").val() +  '&date=' + dueDate + '&lastupdated=' + model.getDateTime();
	$.ajax({
		url : requestLink,
		beforeSend: function(){
                   $("#spinner").show();
               },
		success : function(id) 
		{
			$("#spinner").hide();
			if(id == '') {
				alert("Shared folders not createable yet");
				return;
			}
			else if(id == 0) {
				alert("please try again");
				return;
			}
			alert($("#todo-name").val() + " was successfully added");
			upDateTodoLists(parentId,id,todoTitle,todoDesc,dueDate);
			removeTodoForm();
		}
	});
}

function updatePageWithModel()
{
	var pathname = ($(location).attr('hash')).substring(1);
	var hashArray = pathname.split('-');
	var request = hashArray[0];
	var theTitle = hashArray[2];
	var theId = hashArray[1];
	if($(window).width() < 768) closeNavs();
	if(request == 'todoview') 
	{
		var todo = findTodo(theId,home);
		$("#content").html(makeView(todo,1));
		var pathname = ($(location).attr('hash')).substring(1);
		if(pathname =='' || pathname =='home') model.showDueTodos();
		resetListeners();
	}
	else if(request == 'todolist') 
	{
		var todo = findTodo(theId,home);
		$("#content").html(makeList(todo));
		resetListeners();
	}
	else
	{
		var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" +pathname.toLowerCase();
		$.ajax({
			url : requestLink,
			beforeSend : function() {
				$("#spinner").show();
			},
			success : function(result) {
				$("#spinner").hide();
				$("#content").html(result);
				var pathname = ($(location).attr('hash')).substring(1);
				if(pathname =='' || pathname =='home') model.showDueTodos();
				resetListeners();
				scrollToElement($('#content'));
			}
		});
	}
}

function updatePage()
{
	var pathname = ($(location).attr('hash')).substring(1);
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" +pathname.toLowerCase();
	$.ajax({
		url : requestLink,
		beforeSend : function() {
			$("#spinner").show();
		},
		success : function(result) {
			$("#spinner").hide();
			$("#content").html(result);
			var pathname = ($(location).attr('hash')).substring(1);
			if(pathname =='' || pathname =='home') model.showDueTodos();
			resetListeners();
			scrollToElement($('#content'));
		}
	});
	
}

function updateTodoCompleted(id,isChecked){
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?treeId=" + id + "&complete=" + isChecked + '&lastupdated=' + model.getDateTime();;
	$.ajax({
		url : requestLink,
		success : function(result) {
			var todo = findTodo(id,home);
			todo.setCompleted(isChecked);
			if(!todo.isCompleted()) model.addDueTodo(todo);
			else remove(model.getDueTodo(),todo);
			model.showDueTodos();
		}
	});
}

function showComments(element,title)
{
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" + title;
	$.ajax({
		type : "POST",
		url : requestLink,
		beforeSend : function() {
			$("#spinner").show();
		},
		success : function(result) {
			$("#spinner").hide();
			unsetListeners();
			$(element).append('hi');
			$(element).css("width", "100%");
			$(element).html(result);
			$(element).hide();
			$(element).slideDown();
			//scrollToElement($(element),1000,-150);
			addButtons();
		}
	});
}

function getModel()
{
	return model;
}

function setMenuId(id)
{
	currentMenuId = id;
}

function populateHome(todoTree)
{
	home = todoTree;
	resetListeners();
	model.updateTree(home);
	notify();
}

function notify()
{
	setInterval("model.checkTreeForUpdates()",30000);	
}
