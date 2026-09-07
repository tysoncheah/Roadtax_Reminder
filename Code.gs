function sendExpiryAlerts() {
  // Replace YOUR_SPREADSHEET_ID_HERE with your actual ID from the URL
  var spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; 
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  
  // This grabs the active/first sheet tab automatically
  var sheet = spreadsheet.getActiveSheet(); 

  var startRow = 8; // Data starts at row 8
  var lastRow = sheet.getLastRow();
  
  if (lastRow < startRow) return;

  var numRows = lastRow - startRow + 1;
  var dataRange = sheet.getRange(startRow, 1, numRows, 6);
  var data = dataRange.getValues();
  
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var clientName = row[1]; // Column B
    var vehicleNo = row[2];  // Column C
    var daysLeft = row[4];   // Column E
    var status = row[5];     // Column F (Checkbox)
    
    // Sends email if 0 days left and checkbox is UNCHECKED (false)
    if (daysLeft === 0 && status === false) {
      var emailAddress = Session.getActiveUser().getEmail();
      var subject = "URGENT: Road Tax Expiring Today - " + vehicleNo;
      var message = "Client: " + clientName + "\nVehicle No: " + vehicleNo + "\nRoad tax expires today!";
      MailApp.sendEmail(emailAddress, subject, message);
    }
  }
}
