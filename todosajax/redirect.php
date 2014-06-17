<?php
	$loggedIn = false;
	session_start();
	if(isset($_SESSION['status']))
	{
		if($_SESSION['status'] == 'true') $loggedIn = true;
	}
	if(isset($_REQUEST['treeId']))
	{
		include '0700_inc/common_inc.php';
		include '0700_inc/conn_inc.php';
		include '0700_inc/class.model_inc.php';

		if(isset($_REQUEST['complete']))
		{
			$treeId = $_REQUEST['treeId'];
			$completed = $_REQUEST['complete'];
			updateTodoCompletion($treeId,$completed);
		}
		elseif(isset($_REQUEST['name']))
		{
			$treeId = $_REQUEST['treeId'];
			if($treeId == 0) {
				return -1;
			}
			$todoTitle = $_REQUEST['name'];
			$todoDesc = $_REQUEST['info'];
			$todoDate = $_REQUEST['date'];
			
			$isAdded = addNewTodoItemto($treeId,$todoTitle,$todoDesc,$todoDate);
			return $isAdded;
		}
	}
	else
	{
		$requestInfo = $_REQUEST['requestedinfo'];
		$requestArray = split('-',$requestInfo);
		$request = $requestArray[0];
		$theTitle = $requestArray[2];
		$theId = $requestArray[1];
		
		if($request == 'repolist') include 'repo-list.php';
		else if($request == 'home' || $request == '' || !$loggedIn) include 'home.php';
		else if($request == 'settings') include 'settings.php';
		else if($request == 'todoview') include 'todo-view.php';
		else if($request == 'todolist') include 'todo-list.php';
		else if($request == 'repolist') include 'repo-list.php';
		else if($request == 'comments') include 'comments.php';
		else echo 'Error, not found<br>requestedInfo:'.$requestInfo.'<br>request:'.$request.'<br>theTitle:'.$theTitle.'<br>theId:'.$theId;
	}
	//echo '<script>alert(' .$_REQUEST['hash'] . ');';
?>