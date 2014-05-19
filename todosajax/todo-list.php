<!--<h2 class="title"><?php echo $theTitle;?></h2>-->

<?php
include '0700_inc/common_inc.php';
include '0700_inc/conn_inc.php';
include '0700_inc/class.model_inc.php';

$id = getIdFromTitle($theTitle);
$parent = getListInfo($id,'');
//$view = $parent;
//include 'todo-view-template.php';
//echo '<section class="col12 list-block background">';
//echo hash('haval256,4','seattlecentral');
echo makeView($parent,'');
$views = $parent->getChildren();

for ($i=0; $i < count($views) ; $i++) { 
	echo makeView($views[$i],($i+1) . '. ');
}
?>
<!--<section class="col12 list-block background">
	<div class="li-obj">
		<div class="li-obj-l col7">
			<img class="main-img" src="images/placeholder.png" />
		</div>
		<div class="li-obj-r col5">
			<header>
				<img src="images/placeholder.png" />
				<img src="images/placeholder.png" />
				<img src="images/placeholder.png" />
				<br class="clear"/>
				<h3>SubTitle</h3>
				<p>Description</p>
			</header>
			
		</div>
		<footer class="col5">
			<div class="obj-info col8">
				<p>5 of 7</p>
				<p>Complete</p>
			</div>
			<div class="obj-action col3">
				<label><input type="checkbox">Mark As Done</label>
				<p class="show-info" href="comments" id="0">Comments/WorkLog</p>
			</div>
		</footer>
		<br class="clear"/>
	</div>
</section>
<div id="count0"></div>
<section class="col12 list-block background">
	<div class="li-obj">
		<div class="li-obj-l col7">
			<img class="main-img" src="images/placeholder.png" />
		</div>
		<div class="li-obj-r col5">
			<header>
				<img src="images/placeholder.png" />
				<img src="images/placeholder.png" />
				<img src="images/placeholder.png" />
				<br class="clear"/>
				<h3>SubTitle</h3>
				<p>Description</p>
			</header>
			
		</div>
		<footer class="col5">
			<div class="obj-info col8">
				<p>5 of 7</p>
				<p>Complete</p>
			</div>
			<div class="obj-action col3">
				<label><input type="checkbox">Mark As Done</label>
				<p class="show-info" href="comments" id="1">Comments/WorkLog</p>
			</div>
		</footer>
		<br class="clear"/>
	</div>
</section>
<div id="count1"></div>-->