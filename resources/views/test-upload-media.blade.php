<!DOCTYPE html>
<html>
<head>
    <title>Test Media Upload</title>
</head>
<body style="font-family: Arial; padding: 40px;">
    <h2>Test Upload Media</h2>

    <form action="{{ url('/api/media/upload') }}" method="POST" enctype="multipart/form-data">
    <label>Guest ID:</label>
    <input type="number" name="guest_id" required>

    <br><br>

    <label>Files:</label>
    <input type="file" name="files[]" multiple required>

    <br><br>

    <button type="submit">Upload</button>
</form>
</body>
</html>