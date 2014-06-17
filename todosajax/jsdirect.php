<?php
$loggedIn = false;
session_start();
if (isset($_SESSION['status'])) {
	if ($_SESSION['status'] == 'true')
		$loggedIn = true;
}
if (isset($_REQUEST['jsrequest'])) {
	include '0700_inc/common_inc.php';
	include '0700_inc/conn_inc.php';
	include '0700_inc/class.model_inc.php';

	if ($_REQUEST['jsrequest'] == "getall") {
		$treeId = $_SESSION['treeid'];
		$homedir = new Node("1","home","0","0","00-00-0000","00-00-0000");
		for ($i = 0; $i < count($treeId); $i++) {
			//echo $treeId[$i];
			$homedir->addChild(createSQL($treeId[$i], 8));
		}
		header('Content-Type: application/json');
		$encodedModel = json_encode($homedir->toArray());
		echo $encodedModel;
	}
	else if($_REQUEST['jsrequest'] == "checkforupdate")
	{
		$todoId = $_REQUEST['todoid'];
		$todoLast = $_REQUEST['todolast'];
		$update = checkForUpdate($todoId,$todoLast);
		echo $update;
	}
	else if($_REQUEST['jsrequest'] == "getextra")
	{
		$todoId = $_REQUEST['todoid'];
		$update = getViewInfo2($todoId);
		header('Content-Type: application/json');
		$encodedTodo = json_encode($update->toArray());
		echo $encodedTodo;
	}
} else
	echo 'nope';
?>