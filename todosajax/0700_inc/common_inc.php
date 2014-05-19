<?php

function getSqlData($sql,$model)
{
	$iConn = conn();  

	$result = mysqli_query($iConn,$sql) or die(trigger_error(mysqli_error($iConn), E_USER_ERROR));

	if(mysqli_num_rows($result) > 0)
	{
		$count = 1;
		$wasNull = false;
		$todos = array();
		$todos[] = $model;
		$model = array();
		while($row = mysqli_fetch_assoc($result))
		{
		 
			//only gets one version of each node
			for ($i=0; $i < count($row); $i++) 
			{ 
				if($row['lev'.(($i%8)+1).'title'] != NULL)
				{
					if(count($model) == 0) $model[] = new Node($row['lev'.(($i%8)+1).'id'],$row['lev'.(($i%8)+1).'title'],$row['lev'.(($i%8)+1).'parent'],$row['lev'.(($i%8)+1).'completed']);
					$found = false;
					for($j=0;$j<count($todos);$j++)
					{
						if($todos[$j] == $row['lev'.(($i%8)+1).'id']){
							$found = true;
							break;
						}
					}
					if(!$found)
					{
						 $model[] = new Node($row['lev'.(($i%8)+1).'id'],$row['lev'.(($i%8)+1).'title'],$row['lev'.(($i%8)+1).'parent'],$row['lev'.(($i%8)+1).'completed']);
						$todos[] = $row['lev'.(($i%8)+1).'id'];	 
					}
				}
			}
			
		}
		//sorts nodes
		/*for ($i=0; $i < count($model)-1; $i++) 
		{
			for ($j=$i+1; $j < count($model) ; $j++) 
			{ 
				if($model[$i]->getParent() > $model[$j]->getParent())
				{
					$temp = $model[$i]->getCopy();
					$model[$i] =$model[$j]->getCopy();
					$model[$j] = $temp->getCopy();
				}
			}
		}*/
		$root = $model[0]->getCopy();
		//$awesome = makeTree($model,$root);
		$homedir = makeTree($model,$root);
		//testTree($awesome,'');
		//echo '<nav class="todome"><ul id="todo-new">';
		//createUL($awesome);
		//echo '</ul></nav>';
		//$homedir = new Node(1,"home",0,0);
		//$homedir->addChild($awesome);
		//echo '<nav class="todome">';
		//createULS($homedir,"top-element",true);
		//echo '</nav>';
	}	
	@mysqli_free_result($result);
	return $homedir;
}

function createSQL($value, $depth)
{
	$sql ='SELECT ';
		for ($i=0; $i <$depth ; $i++) { 
			$sql .= 't' . ($i+1) . '.id as lev' . ($i+1) . 'id, t' . ($i+1) . '.title as lev' . ($i+1) . 'title, t' . ($i+1) . '.parent  as lev' . ($i+1) . 'parent, t' . ($i+1) . '.completed as lev' . ($i+1) . 'completed';
			if($i < $depth-1) $sql .= ', ';
		}
		$sql .= ' FROM todo_list AS t1 ';
		for ($i=0; $i <$depth -1 ; $i++) { 
			$sql .= 'LEFT JOIN todo_list AS t' . ($i+2) . ' ON t' . ($i+2) . '.parent = t' . ($i+1) . '.id ';
		}
		$sql .= 'WHERE t1.id = '. $value .'';
		
		$result = getSqlData($sql,$value);
		return $result;
}
function getIdFromTitle($title)
{
	$sql = 'Select tl.id from todo_list as tl where tl.title = "'.$title.'"';

	$iConn = conn();  

	$result = mysqli_query($iConn,$sql) or die(trigger_error(mysqli_error($iConn), E_USER_ERROR));
	$id = '';
	if(mysqli_num_rows($result) > 0)
	{
		while($row = mysqli_fetch_assoc($result))
		{
			$id = $row['id'];
		}
	}

	//var_dump($parent);
	@mysqli_free_result($result);
	return $id;

}

function getListInfo($id)
{
	$sql = 'Select tl.id, tl.title, tl.parent, tl.completed,ti.desc, img.img_src from todo_list as tl 
join todo_info as ti on tl.id = ti.todo_id 
left join todo_img as img on tl.id = img.todo_id 
where tl.parent = "'.$id.'" or tl.id = "'.$id.'" order by tl.id asc';
	$iConn = conn();  

	$result = mysqli_query($iConn,$sql) or die(trigger_error(mysqli_error($iConn), E_USER_ERROR));
	$parent = null;
	$view = null;
	$currentId = null;
	if(mysqli_num_rows($result) > 0)
	{
		while($row = mysqli_fetch_assoc($result))
		{
			if($parent == null){
				$parent = new View($row['id'],$row['title'],$row['parent'],$row['completed'],$row['desc']);
				if($row['img_src'] != null) $parent->addImage($row['img_src']);
				$currentId = $row['id'];
			}
			else if($row['id'] == $currentId){
				if($parent->getId() == $currentId) $parent->addImage($row['img_src']);
				else $view->addImage($row['img_src']);
			}
			else{
				$view = new View($row['id'],$row['title'],$row['parent'],$row['completed'],$row['desc']);
				if($row['img_src'] != null) $view->addImage($row['img_src']);
				$currentId = $row['id'];
				$parent->addChild($view);
			}
		}
	}

	//var_dump($parent);
	@mysqli_free_result($result);
	return $parent;
}

function makeView($view, $stepNum)
{
	$contentView = '';
	$checked = '';
	if($view != null && $view->isCompleted()) $checked = "checked";

$contentView .= '<div id="view-' . $view->getId() .'">
<h2 class="title">'.$stepNum.$view->getTitle().'</h2>
<section class="col12 list-block background">
	<div class="li-obj">';

$images = $view->getImages();
if(count($images) > 0)
{
	$contentView .= '
	<div class="li-obj-l col7">
		<img class="main-img" src="'.$images[0].'" />
	</div>
	';
}		
$contentView .=	
'<div class="li-obj-r col5">
	<header>';
if(count($images) > 1)
{
	for ($i=0; $i < count($images); $i++) { 
		$contentView .= '<img src="'.$images[$i].'" />';
	}
	$contentView .= '<br class="clear"/>';
}
$contentView .=	'
	<p>'.$view->getDesc().'</p>
</header>
	</div>
		<footer class="col5">
			<div class="obj-info col8">
				<p>5 of 7</p>
				<p>Complete</p>
			</div>
			<div class="obj-action col3">
				<label><input type="checkbox" '.$checked . '>Mark As Done</label>
				<p class="show-info" href="comments" id="0">Comments/WorkLog</p>
			</div>
		</footer>
		<br class="clear"/>
	</div>
</section>
<div id="count0">';
//$contentView .= makeComments($view);
$contentView .= '
</div>
</div>
<br class="clear">
';
return $contentView;
}

function makeComments($view)
{
	$content = '
<section class="obj-updates col12 background">
	<div class="obj-comments col7">
		<h3>Comments:</h3>
		<p>4/16/2014</p>
		<p>Tim</p>
		<p>I think we should change the title of this to Sub subtitle?</p>
		<textarea rows="4"></textarea>
	</div>
	<div class="obj-log col5">
		<h3>Notifications:</h3>
		<h2 class="close">X</h2>
		<p>SubTask1 finished by Tim on 4/14/2014</p>
	</div>
</section>
';	
return $content;
}
function getViewInfo($title)
{
	$sql = 'Select tl.id, tl.title, tl.parent, tl.completed,ti.desc, img.img_src from todo_list as tl join todo_info as ti on tl.id = ti.todo_id left join todo_img as img on tl.id = img.todo_id where tl.title = "'.$title .'"';
	$iConn = conn();  

	$result = mysqli_query($iConn,$sql) or die(trigger_error(mysqli_error($iConn), E_USER_ERROR));
	$view = null;
	if(mysqli_num_rows($result) > 0)
	{
		$count = 0;
		while($row = mysqli_fetch_assoc($result))
		{
			if($count == 0){
				$view = new View($row['id'],$row['title'],$row['parent'],$row['completed'],$row['desc']);
			}
			if($row['img_src'] != null) $view->addImage($row['img_src']);
			
			$count++;
		}
	}
	@mysqli_free_result($result);
	return $view;
}
function createULS($node,$firstelement,$firstId)
{
	$children = $node->getChildren();
	if(count($children) > 0)
	{
		$ulId = $node->getId();
		$h4Id = $node->getParent();
		if($firstId) {
			$ulId = "todo-nav";
		}
		if($h4Id == 1) $h4Id ='todo-nav';
		$parentTitle = $node->getTitle();
		if(strlen($parentTitle) > 20)$parentTitle = substr($parentTitle,0,16) . "...";
		echo '<ul id="list-'.$ulId.'" class="'.$firstelement.' top-nav-item todolist text-nav todolistnav"><h4 class="back-navigation" href="'.$h4Id.'"><-'.$parentTitle.'<img href="'.$ulId.'" class="add-item nav-image" src="images/add.png"></h4>';
		$firstelement = '';
		$firstId = false;
		for ($i=0; $i < count($children) ; $i++) {
			$childTitle = $children[$i]->getTitle();
			if(strlen($childTitle) > 20)$childTitle = substr($children[$i]->getTitle(),0,20) . "...";
			
			if(count($children[$i]->getChildren()) > 0)
			{
				$completed ='checked.png';
				$subChildren = $children[$i]->getChildren();
				for ($j=0; $j < count($subChildren); $j++) { 
					if(!$subChildren[$j]->isCompleted()){
						$completed ='blank.gif';
						break;
					} 
				}
				echo '<li>
					<img class="child-status nav-image" src="images/'.$completed.'" />
					<p class="todo-navigation todo-nav-title" href="'.$children[$i]->getId().'">'. $childTitle . '</p>
					<p class="ajax-request todo-nav-info">
						<a href="#todolist-'. $children[$i]->getTitle() . '">
							<img class="child-info nav-image" src="images/view.png" />
						</a>
					</p>
				</li>';
			}else{
				$completed = '';
				if($children[$i]->isCompleted()) $completed = 'checked';
				echo '<li>
						<input class="css-checkbox" type="checkbox" name="todo-item" value="'.$children[$i]->getId().'" '.$completed.'>
						<p class="ajax-request todo-nav-title">
							<a href="#todoview-'. $children[$i]->getTitle() . '">'. $childTitle . '</a>
						</p>
						<img href="'.$children[$i]->getId().'" class="add-sub-item child-status nav-image" src="images/addsub.png" />
						<br class="clear" />
					</li>';
			}
		}
		echo '</ul>';
		for ($i=0; $i < count($children); $i++) { 
			createULS($children[$i],$firstelement,'');
		}
		
	}
	//echo '</li>';
}
function addNewTodoItemto($treeId,$title,$desc){
	
	$sql1 = 'INSERT INTO `todo_list`(`id`, `title`, `parent`, `completed`) VALUES (null,"'.$title.'",'.$treeId.',0)';
	$sql2 = 'INSERT INTO `todo_info`(`id`, `desc`, `todo_id`) VALUES (null,"'.$desc.'",LAST_INSERT_ID())';
	$iConn = conn('insert');  

	try {
		  /* switch autocommit status to FALSE. Actually, it starts transaction */
		  $iConn->autocommit(FALSE);
		 
		  $res = $iConn->query($sql1);
		  if($res === false) {
		    throw new Exception('Wrong SQL: ' . $sql1 . ' Error: ' . $iConn->error);
		  }
		  
		  $res = $iConn->query($sql2);
		  var_dump($res);
		  if($res === false) {
		    throw new Exception('Wrong SQL: ' . $sql2 . ' Error: ' . $iConn->error);
		  }
		 
		  $iConn->commit();
		  echo 'Transaction completed successfully!';
		 
		} catch (Exception $e) {
		  echo 'Transaction failed: ' . $e->getMessage();
		 
		  $iConn->rollback();
		}
		 
		/* switch back autocommit status */
		$iConn->autocommit(TRUE);
	
	@mysqli_free_result($res);
	return true;
}

function makeTree($tree,$root)
{
	for ($i=0; $i < count($tree) ; $i++) { 
		if($tree[$i]->getParent() == $root->getId())
		{
			$child = makeTree($tree,$tree[$i]);
			$root->addChild($child);
		}
	}
	return $root;
	
}

function checkCred($username, $password)
{
	$hashp = hash('haval256,4',$password);
	
	$sql = 'Select t.tree_id, u.user_name, u.user_password from user as u 
	join todo_tree as t where t.user_id = u.user_id 
	AND u.user_name =  "'.$username.'"';

	$userId = array();
	$hashedPassword =null;
	$iConn = conn();  
	$result = mysqli_query($iConn,$sql) or die(trigger_error(mysqli_error($iConn), E_USER_ERROR));
	$view = null;
	if(mysqli_num_rows($result) > 0)
	{
		
		while($row = mysqli_fetch_assoc($result))
		{
			$hashedPassword = $row['user_password'];
			$userId[] = $row['tree_id'];
		}
	}
	@mysqli_free_result($result);
	if($hashedPassword == $hashp) return $userId;
	return null;
}

function startSession()
{
	if(isset($_SESSION)) return true;
	else session_start();
}
?>