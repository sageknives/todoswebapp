function findTodo(id,todo)
{
	if(todo == null) todo = getModel().getHomeInstance();
	if(todo.getId() == id) return todo;
	else
	{
		var children = todo.getChildren();
		for(var i=0;i<children.length;i++)
		{
			var maybeTodo = findTodo(id,children[i]);
			if(maybeTodo != null) return maybeTodo;
		}
		return null;
	}	
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

function boolToNum(isTrue)
{
	if(isTrue) return 1;
	return 0;
};

function sortByCompleted(list)
{
	for ( var i=0; i < list.length; i++) 
	{
		for (var j=i+1; j < list.length; j++) 
		{ 
			if(boolToNum(list[i].isCompleted()) > boolToNum(list[j].isCompleted()))
			{
				var temp = list[i];
				list[i] = list[j];
				list[j] = temp;				
			}
		}
	}	
	return list;
};

function sortByDueDate(list)
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

function resetListeners()
{
	unsetListeners();
	addButtons();
}