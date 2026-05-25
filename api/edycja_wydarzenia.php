<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));

    if (
        isset($data->id_wydarzenia) &&
        isset($data->nazwa) &&
        isset($data->data) &&
        isset($data->godzina) &&
        isset($data->opis)
    ) {
        $id_wydarzenia = $data->id_wydarzenia;
        $nazwa = $data->nazwa;
        $data_wydarzenia = $data->data;
        $godzina = $data->godzina;
        $opis = $data->opis;

        $sql = "UPDATE wydarzenia
                SET nazwa = :nazwa, data = :data, godzina = :godzina, opis = :opis
                WHERE id_wydarzenia = :id_wydarzenia";

        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':nazwa', $nazwa, PDO::PARAM_STR);
        $stmt->bindParam(':data', $data_wydarzenia, PDO::PARAM_STR);
        $stmt->bindParam(':godzina', $godzina, PDO::PARAM_STR);
        $stmt->bindParam(':opis', $opis, PDO::PARAM_STR);
        $stmt->bindParam(':id_wydarzenia', $id_wydarzenia, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode(array("success" => true, "message" => "Wydarzenie zostało zaktualizowane"));
    } else {
        echo json_encode(array("success" => false, "message" => "Brak wymaganych danych do edycji"));
    }
} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "Błąd bazy danych: " . $e->getMessage()));
}
?>