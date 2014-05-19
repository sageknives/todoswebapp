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

		$treeId = $_REQUEST['treeId'];
		if($treeId == 0) {
			return -1;
		}
		$todoTitle = $_REQUEST['name'];
		$todoDesc = $_REQUEST['info'];
		
		$isAdded = addNewTodoItemto($treeId,$todoTitle,$todoDesc);
		return $isAdded;
	}
	else
	{
		$requestInfo = $_REQUEST['requestedinfo'];
		$request = substr($requestInfo, 0,8);
		$theTitle = substr($requestInfo, 9);
		
		if($request == 'repolist') include 'repo-list.php';
		else if($request == 'home' || $request == '' || !$loggedIn) include 'home.php';
		else if($request == 'settings') include 'settings.php';
		else if($request == 'todoview') include 'todo-view.php';
		else if($request == 'todolist') include 'todo-list.php';
		else if($request == 'repolist') include 'repo-list.php';
		else if($request == 'comments') include 'comments.php';
		else echo 'Error, not found';
	}
	//echo '<script>alert(' .$_REQUEST['hash'] . ');';
?>