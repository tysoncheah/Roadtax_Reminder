readme_content = """# Road Tax Renewal Tracker & Automated Alert System

An automated Google Sheets solution designed for car insurance agents and individual owners to track road tax / insurance expiry dates, maintain renewal statuses, and receive daily automated email reminders directly to their phone when a policy is expiring.

---

## 📌 Features

- **Automated Expiry Alerts:** Daily background script checks for policies expiring on the current day and sends email notifications.
- **Visual Status Tracking:** Easily manage pending vs. completed renewals with built-in checkboxes.
- **Customizable Dashboard:** Track urgent renewals (< 30 days) and total pending tasks at a glance.
- **Cross-Platform Notifications:** Email alerts automatically trigger mobile push notifications on Android & iOS.

---

## 🛠️ Google Sheets Setup

### 1. Sheet Structure
Ensure your Google Sheet (tab named `Roadtax Renew`) is formatted with the following columns starting from **Row 7**:

| Column | Field Name | Description |
| :--- | :--- | :--- |
| **B** | `Client Name` | Name of the client or owner |
| **C** | `Vehicle No.` | Vehicle registration number |
| **D** | `Road Tax Expiry Date` | Expiry date formatted as `YYYY-MM-DD` |
| **E** | `Days Until Expiry` | Formula to calculate remaining days (e.g., `=D8-TODAY()`) |
| **F** | `Status (Done)` | Checkbox (`TRUE` for Done, `FALSE` for Pending) |

---

## ⚙️ Google Apps Script Configuration

### 1. Add Script to Google Sheets
1. Open your Google Sheet.
2. Click **Extensions** > **Apps Script**.
3. Clear any existing placeholder code and paste the following script into `Code.gs`:

```javascript
function sendExpiryAlerts() {
  // Replace with your actual Spreadsheet ID from the URL
  var spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; 
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName('Roadtax Renew');
  
  if (!sheet) {
    Logger.log("Sheet 'Roadtax Renew' not found. Please verify the tab name.");
    return;
  }

  var startRow = 8; // Data rows start at row 8
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
      var message = "Client: " + clientName + "\\nVehicle No: " + vehicleNo + "\\nRoad tax expires today!";
      MailApp.sendEmail(emailAddress, subject, message);
    }
  }
}
