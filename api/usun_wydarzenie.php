<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$host = 'localhost';
$dbname = 'culturify';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->eventId)) {
        $eventId = $data->eventId;

        $sql = "DELETE FROM wydarzenia WHERE id_wydarzenia = :eventId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false, "message" => "Brak identyfikatora wydarzenia (eventId)"));
    }
} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "Blad bazy danych: " . $e->getMessage()));
}
?>
