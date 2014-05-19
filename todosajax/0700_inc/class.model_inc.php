<?php
//database objects

class nav {
	private $sectionTitle;
	private $sectionImg;
	private $courseName;
	private $courseFolder;
	
	
	function __construct($sectionTitle,$sectionImg, $courseName, $coursefolder)
	{
		$this->sectionTitle = $sectionTitle;
		$this->sectionImg = $sectionImg;
		$this->courseName = $courseName;
		$this->courseFolder = $coursefolder;
	}
	
	function getTitle()
	{
		return $this->sectionTitle;
	}
	function getImg()
	{
		return $this->sectionImg;
	}
	function getNumSubs()
	{
		return count($this->courseName);
	}
	function getSubTitle($position)
	{
		return $this->courseName[$position];
	}
	function getfolder($position)
	{
		return $this->courseFolder[$position];
	}
}

class container{
	protected $items = array();
	
	function __contruct()
	{
		
	}
	
	function getItems()
	{
		return $this->items;
	}
	
	function addItem($values)
	{
		$this->items[] = $values;
	}
}
class Node
{
	private $id;
	private $title;
	private $parent;
	private $isComplete;
	private $children = array();
	
	function __construct($id,$title,$parent,$isComplete)
	{
		$this->id = $id;
		$this->title = $title;
		$this->parent = $parent;
		$this->isComplete = $isComplete;
	}
	
	public function getId()
	{
		return $this->id;
	}
	
	public function getTitle()
	{
		return $this->title;
	}
	
	public function getParent()
	{
		return $this->parent;
	}
	
	function setId($id)
	{
		$this->id;
	}
	
	function setTitle($title)
	{
		$this->title;
	}

	function setParent($parent)
	{
		$this->parent;
	}
	public function __toString() {
        return $this->title;
    }
	
	public function addChild($node)
	{
		$this->children[] = $node;
	}
	
	public function getChildren()
	{
		$this->children = $this->sortByCompleted($this->children);
		return $this->children;
	}
	
	private function sortByCompleted($list)
	{
		for ($i=0; $i < count($list)-1; $i++) 
		{
			for ($j=$i+1; $j < count($list) ; $j++) 
			{ 
				if($this->boolToNum($list[$i]->isCompleted()) > $this->boolToNum($list[$j]->isCompleted()))
				{
					$temp = $list[$i]->getCopy();
					$list[$i] = $list[$j]->getCopy();
					$list[$j] = $temp->getCopy();
				}
			}
		}	
		return $list;
	}
	public function getCopy()
	{
		$copy =new Node($this->id,$this->title,$this->parent,$this->isComplete);
		$children = $this->getChildren();
		for ($i=0; $i < count($children) ; $i++) { 
			$copy->addChild($children[$i]->getCopy());
		}
		return $copy;
	}
	private function boolToNum($bool)
	{
		if($bool) return 1;
		return 0;
	}
	public function isCompleted()
	{
		return $this->isComplete;
	}
}

class View
{
	private $id;
	private $title;
	private $parent;
	private $completed;
	private $desc;
	private $images = array();
	private $children = array();
	
	function __construct($id,$title,$parent,$completed,$desc)
	{
		$this->id = $id;
		$this->title = $title;
		$this->parent = $parent;
		$this->completed = $completed;
		$this->desc = $desc;
	}
	
	public function getId()
	{
		return $this->id;
	}
	
	public function getTitle()
	{
		return $this->title;
	}
	
	public function getParent()
	{
		return $this->parent;
	}
	
	public function isCompleted()
	{
		return $this->completed;
	}
	
	public function getDesc()
	{
		return $this->desc;
	}
	
	public function addImage($image)
	{
		$this->images[] = $image;
	}
	
	public function getImages()
	{
		return $this->images;
	}
	
	public function addChild($node)
	{
		$this->children[] = $node;
	}
	
	public function getChildren()
	{
		return $this->children;
	}
	
}
/*class Node
{
	private $children;
	
    function __construct()
    {
        $children = array();
    }

	function getName(){
		return $this->name;
	}
	function setName($name){
		$this->name = $name;
	}
	function getChildren()
	{
		return $this->children;
	}
	function setChildren($children)
	{
		$this->children =$children;
	}
}

/*class resources extends container
{
	function __construct()
	{
		
	}	
	function addItem($name,$source)
	{
		$items[] = array($name,$source);
	}
	
}

class person extends container
{	
	function addItem($values)
	{
		$items[] = $values;
	}
	
}*/
