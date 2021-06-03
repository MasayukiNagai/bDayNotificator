class BirthDay{
  constructor(){
    this.nameColumn = 1;
    this.yearColumn = 2;
    this.monthColumn = 3;
    this.dateColumn = 4;
  }
  
  getBirthdayPerson(sheet, month, date, year){
    let bDayNameAndAge = []
    for(let i = 2; i <= sheet.getLastRow(); i++){
      let bMonth = sheet.getRange(i, this.monthColumn).getValue();
      let bDate = sheet.getRange(i, this.dateColumn).getValue();
      if (month == bMonth && date == bDate){
        let name = sheet.getRange(i, this.nameColumn).getValue();
        let age = year - sheet.getRange(i, this.yearColumn).getValue();
        bDayNameAndAge.push({'Name': name, 'Age': age})
      }
    }
    return bDayNameAndAge;
  }
  
  getBDayText(bDayNameAndAge){
    let content = '今日は、';
    let bDayText = bDayNameAndAge.map(bDayElement => {
                     return bDayElement['Name'] + 'さんの'　+ bDayElement['Age'] + '歳の'
                   })
    content += bDayText.join('、')
    content += 'お誕生日です!';
    return content
  }
}
  
function getDate(){
  const date = new Date();
  const date_dict = {'Month': date.getMonth()+1, 
                    'Date': date.getDate(), 
                    'Year': date.getFullYear()}
  return date_dict;
}

function getSpreadSheetKey(){
  return PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_KEY");
}

function getLineNotifyToken(){
  return PropertiesService.getScriptProperties().getProperty("LINE_NOTIFY_TOKEN");
}

function sendPostContent(content) {
  var token = [getLineNotifyToken()];
  var options = {
      "method": "post",
      "payload" : {"message": content },
      "headers": {"Authorization": "Bearer " + token}    
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

function myFunction(){
  const spreadSheetKey = getSpreadSheetKey();
  const SPREAD_SHEET_TAB_NAME = 'Birthday';
  const bDaySheet = SpreadsheetApp.openById(spreadSheetKey).getSheetByName(SPREAD_SHEET_TAB_NAME);

  const date = getDate();
  const bDay = new BirthDay()
  bDayNameAndAge = bDay.getBirthdayPerson(bDaySheet, date['Month'], date['Date'], date['Year'])

  if(bDayNameAndAge.length == 0){
    return ;
  }

  const content = bDay.getBDayText(bDayNameAndAge)
  sendPostContent(content);
}