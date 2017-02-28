<?php
//*********************************************************
/*
 * 
 * 		
*/		
//*********************************************************

//MYSQL SERVER CONNECTION
	
	//define ("MYSQLHST",$_SERVER['HTTP_HOST']); //Mysql Host
	define ("MYSQLHST","localhost"); //Mysql Host
	
	define ("DATABASE","stahlinsel"); // database on DWSA server
	define ("MYSQLUSR","root"); //Mysql user
	define ("MYSQLPW",""); //Mysql Password

	$datestring = date("# d-m-y [H:i:s] #");
	define ("DATE",$datestring);
	
class model {
	
	function __construct($request = "",$sql = "",$data = array()) {
			

			$this->data = "";
			
			if(!$this->connect()) {
				return "bad bad error on connection failure";		
				}
		
		}
//========================================================================================================================
	private function connect() { 

	$this->mysqli = new mysqli(MYSQLHST, MYSQLUSR, MYSQLPW, DATABASE, "3306");
	
	$this->mysqli->query("SET NAMES 'utf8'");
	if ($this->mysqli->connect_error) {
		$log[0] = "\n".DATE." Connect Error (" . $this->mysqli->connect_errno . ") "
				. $this->mysqli->connect_error;
		exit(json_encode($log[0]));
	}

	return true;	
	}
	//========================================================================================================================		
		//send sql errors to logfile
	private function execute($query,$sql) {
			//in case of bad sql exit this script
		if(!$query) exit(json_encode(array("error" => "Folgender SQL Befehl konnte nicht ausgeführt werden: ".$sql)));
		return $query;	
		}
//========================================================================================================================			
	public function selectArray($sql) {
		

		$query = $this->execute($this->mysqli->query($sql),$sql);
		$hit = $query->num_rows;
		$i = 0;
		$data = array();

		if($hit > 0) {
				//read line by line
			while($result = $query->fetch_assoc()) {
				foreach($result as $key => $value) {
				
				//html decode
				if(is_string($value)) $value = htmlspecialchars_decode($value, ENT_QUOTES);
				
				$data[$i][$key] = $value;
				}
				$i++;
			}
		}
		return $data;
	}
	public function selectSingle($sql) {
		$query = $this->execute($this->mysqli->query($sql),$sql);
		$hit = $query->num_rows;
		$i = 0;
		$data = array();

		if($hit == 1) {
			$result = $query->fetch_assoc();
			foreach($result as $key => $value) {

				//html decode
				if(is_string($value)) $value = htmlspecialchars_decode($value, ENT_QUOTES);
				
				$data[$key] = $value;
			}
		}
		return $data;
	}
	public function save($sql_input) {

		$sql = "INSERT INTO ".$sql_input;
		$this->execute($this->mysqli->query($sql),$sql);
		
		return $sql." successfully commited";
	}
	
	public function delete($sql_input) {
		$sql = "DELETE FROM ".$sql_input;
		$this->execute($this->mysqli->query($sql),$sql);
		
		return $sql." successfully commited";
		
	}
	public function update($sql_input) {
		$sql = "UPDATE ".$sql_input;
		$this->execute($this->mysqli->query($sql),$sql);
		
		return $sql." successfully commited";
		
		}
	
//========================================================================================================================			

} //end class	



