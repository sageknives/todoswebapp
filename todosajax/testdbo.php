<?php
header('Content-type: text/html; charset=utf-8');
//page variables
$title = 'Home';
$loggedIn = false;
ini_set('session.gc_maxlifetime',10);
session_start();

if(isset($_SESSION['status']))
{
	if($_SESSION['status'] == 'true') $loggedIn = true;
}
if (isset($_POST['status'])){
	if($_POST['status'] == 'true') {
		$loggedIn = true;
		$_SESSION['status'] = 'true';
	}
	else{
		session_destroy();
		$loggedIn = false;
	}
	header('Location: index.php');
}
else{
	$noRequest = true;
}
	

//includes
include 'header.php';
?>
<div id="" class="onepcssgrid-1200">
	<?php
		$value = 2;
		$depth = 8;
		$sql ='SELECT ';
		for ($i=0; $i <$depth ; $i++) { 
			$sql .= 't' . ($i+1) . '.id as lev' . ($i+1) . 'id, t' . ($i+1) . '.title as lev' . ($i+1) . 'title, t' . ($i+1) . '.parent  as lev' . ($i+1) . 'parent';
			if($i < $depth-1) $sql .= ', ';
		}
		$sql .= ' FROM todo_list AS t1 ';
		for ($i=0; $i <$depth -1 ; $i++) { 
			$sql .= 'LEFT JOIN todo_list AS t' . ($i+2) . ' ON t' . ($i+2) . '.parent = t' . ($i+1) . '.id ';
		}
		$sql .= 'WHERE t1.id = '. $value .'';
		
		$result = getSqlData($sql,$value);
		
		//echo '<nav class="todome">';
		//createULS($result,"top-element");
		//echo '</nav>';
		
		//var_dump($root);
		//getResults($result->getItems());
		
		function getResults($lists)
		{
			//var_dump($lists);
			//echo 'test';
			//echo $lists[0][0];
			if(is_array($lists))
			{
				//echo ' is not String';
				for ($i=1; $i < count($lists); $i++) {
					echo '<br>list ' .$i .'    
						<br>{<br>';
					for ($j=1; $j <= count($lists[$i]); $j++) {
						if($lists[$i][$j] == null) continue;
						echo '&nbsp;&nbsp;&nbsp;&nbsp;' . $j .': ';
						echo $lists[$i][$j];
						
					} 
					echo '<br>}';
					
					//echo 'huh';
				}
				
			}
			else{
				//echo ' is not array';
				echo $lists;
			}
		}
		
		
	?>
</div>
