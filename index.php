<?php
// DB Connection Details
$con = mysqli_connect("localhost", "root", "root", "tracking");
if(!$con){die("Could not connect: ".mysqli_connect_error());}

// start POST
if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['Add'])){

	$Item = $_POST['Item'] ?: 'None';
	$Order = 99; // adds to end

	$sql_insert = $con->prepare("INSERT INTO projects (project,project_order) VALUES (?,?)");
    $bind_process = $sql_insert->bind_param('si',$Item,$Order);
	$sql_insert->execute();
	$last_inserted = $con->insert_id;

	$response = []; // setup blank array to use
	$response[] = ["success"=> 1, "inserted_id"=>$last_inserted];

	if (mysqli_affected_rows($con) == 0) {
		echo json_encode("DB_0DONE"); // Nothing changed
	} else { // Success
		echo json_encode($response); // sends data array as JSON string to AJAX result
	} // end else   

} // end POST
// Update Order
elseif($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['Order'])){

	$ID = $_POST['ID'] ?: die('Error');
	$Order = $_POST['Order'] ?: 99; // At end if not set
	$sql_update = $con->prepare("UPDATE projects SET project_order = ? WHERE id = ?");
    $bind_process = $sql_update->bind_param('ii',$Order,$ID);
	$sql_update->execute();

	if(mysqli_affected_rows($con) != 0){
		echo json_encode("Item order not changed"); // Nothing changed
	} else { // Success
		echo json_encode("Success with ID: ".$ID); // Reordered
	} // end else   

} // end POST
// Update Order
elseif($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['Delete'])){

	$ID = $_POST['ID'] ?: die('Error');

	$sql_delete = $con->prepare("DELETE FROM projects WHERE id = ?");
    $bind_process = $sql_delete->bind_param('i',$ID);
	$sql_delete->execute();

	if(mysqli_affected_rows($con) == 0){
		echo json_encode("DB_0DONE"); // Nothing changed
	} else {
		echo json_encode("Successfully Deleted ID: ".$ID); // Deleted
	} // end else   

} // end POST
else {
	// display page, not an AJAX POST query from JS
?>

<!DOCTYPE HTML>
<html>
<head>
<title>Drag and Drop - Autosave</title>
<link href="css/styles.css" rel="stylesheet">
</head>

<body>
<header>
	<h1>Drag & Drop with Autosave</h1>

</header>

<div id="PassiveError" class="alert alert-warning" style="display: none"></div>

<div class="wrapper">
	<div class="group">
		<div class="project-list">
			<h2>Current Projects:</h2>
			<ul class='projects'>
			<?php
			$sql_retrieve = $con->prepare("SELECT * FROM projects ORDER BY project_order");
			$sql_retrieve->execute();
			$result = $sql_retrieve->get_result(); 
			if($result->num_rows >0 ){
				while($row=$result->fetch_assoc()){
					echo '<li data-id="'.$row['id'].'">'.$row['project'].'</li>';
					$response[] = $row;
				} // end of while
			} // end of num_rows
			?>
			</ul>
			<div class="delete">Delete</div>
		</div>
		<div class="add-project">
			<h2>Add a Project:</h2>
			<form>
				<p><label for="project">Project Name: </label><input name="project"></p>
				<p>
					<label for="owner">Project Owner:</label>
					<select name="owner">
						<option value="Person 1">Person 1</option>
						<option value="Person 2">Person 2</option>
					</select>
				</p>
				<p>
					Due Date:<br>
					<label for="month">Month:</label>
					<select name="month">
						<option value="January">January</option>
						<option value="February">February</option>
						<option value="March">March</option>
						<option value="April">April</option>
						<option value="May">May</option>
						<option value="June">June</option>
						<option value="July">July</option>
						<option value="August">August</option>
						<option value="September">September</option>
						<option value="October">October</option>
						<option value="November">November</option>
						<option value="December">December</option>
					</select>
					<label for="day">Day:</label>
					<select name="day">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
						<option value="11">11</option>
						<option value="12">12</option>
						<option value="13">13</option>
						<option value="14">14</option>
						<option value="15">15</option>
						<option value="16">16</option>
						<option value="17">17</option>
						<option value="18">18</option>
						<option value="19">19</option>
						<option value="20">20</option>
						<option value="21">21</option>
						<option value="22">22</option>
						<option value="23">23</option>
						<option value="24">24</option>
						<option value="25">25</option>
						<option value="26">26</option>
						<option value="27">27</option>
						<option value="28">28</option>
						<option value="29">29</option>
						<option value="30">30</option>
						<option value="31">31</option>
					</select>
				</p>
				<button class="add">Add</button>
			</form>
		</div>
	</div>
</div>
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
<script src="js/autosave.js"></script>
</body>
</html>
<?php
} // end else (show page)
?>