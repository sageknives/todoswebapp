<?php
include '0700_inc/common_inc.php';
include '0700_inc/conn_inc.php';
include '0700_inc/class.model_inc.php';

$parent = getListInfo($theId,'');
echo makeView($parent,'');
$views = $parent->getChildren();

for ($i=0; $i < count($views) ; $i++) { 
	echo makeView($views[$i],($i+1) . '. ');
}
?>