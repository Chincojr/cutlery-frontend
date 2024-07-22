import dayjs from 'dayjs'
import { DexieGet } from './DexieDb';


export function isValidEmail(email) {
    // Regular expression to match email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
  
export function sortBySeenState(arr) {
  arr.sort((a, b) => {
    const seenStateA = Boolean(a.seenState);
    const seenStateB = Boolean(b.seenState);
    return seenStateA - seenStateB;
  });
  return arr;
}


export function generateRandomString() {
    const currentTime = new Date().toISOString().replace(/[-T:.Z]/g, ''); // Get current time and date in YYYYMMDDHHMMSS format
    const remainingLength = 40 - currentTime.length; // Calculate remaining length for random characters
    
    let randomString = currentTime; // Start with current time and date
    
    // Generate random characters to fill the remaining length
    for (let i = 0; i < remainingLength; i++) {
        randomString += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Append a random lowercase ASCII character
    }
    
    const characters = randomString.split('');
  
    // Shuffle the array randomly
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]]; // Swap elements
    }
  
    // Convert the array of characters back to a string
    const randomizedString = characters.join('');
    return randomizedString;
}
  

export const TodaysDate = () => {
  let today = dayjs().format('YYYY-MM-DDTHH:mm') // display
  let todayArr = today.split("T")
  let presentDay = todayArr[0]
  let presentTime = todayArr[1]
  let presentMonth = dayjs().month() + 1
  let presentYear = dayjs().year()
  let presentDayOfMonth = dayjs().date()

  return {presentDay, presentTime, presentMonth, presentYear, presentDayOfMonth}

}

export function getMonthNameWithSuffix(monthNumber, dayNumber) {
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Array of ordinal suffixes
  const suffixes = ['st', 'nd', 'rd', 'th'];

  // Validate month number
  if (monthNumber < 1 || monthNumber > 11) {
    return 'Invalid month number';
  }

  // Validate random number
  if (dayNumber < 0) {
    return 'Random number should not ble less than 0';
  }

  // Get the month name
  const monthName = months[monthNumber];

  // Get the appropriate ordinal suffix for the random number
  let suffixIndex;
  if (dayNumber % 10 === 1 && dayNumber !== 11) {
    suffixIndex = 0; // st
  } else if (dayNumber % 10 === 2 && dayNumber !== 12) {
    suffixIndex = 1; // nd
  } else if (dayNumber % 10 === 3 && dayNumber !== 13) {
    suffixIndex = 2; // rd
  } else {
    suffixIndex = 3; // th
  }

  // Return the formatted string
  return { monthName, dayWithSuffix: `${dayNumber}${suffixes[suffixIndex]}`};
}

export function geetInputDate(date){

}

export function timeCompare(time1, time2) {
  // Split the time strings into hours and minutes
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);


  // Compare the hours
  if (hours1 > hours2) {
      return true;
  } else if (hours1 < hours2) {
      return false;
  }

  // If hours are equal, compare the minutes
  return minutes1 > minutes2;
}

export function checkPasswordStrength(input) {
  const regex = /^(?=.*[a-zA-Z0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).+$/;
  return regex.test(input);
}

export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const HandleLogOut = () => {
  deleteCookie("log")
  deleteCookie("uid")
  deleteCookie("adminUid")
  window.location.href = 'login'
}

export function getCookie(name) {
  // Create a name pattern to search for
  let nameEQ = name + "=";
  // Split the cookie string into individual cookies
  let ca = document.cookie.split(';');
  // Loop through the cookies array
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      // Remove any leading spaces
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      // Check if the cookie starts with the desired name
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  // Return null if the cookie is not found
  return null;
}

export function SearchInfoBasedOfType(unfilteredInfo,searchText, type) {
 // Filter the info based of title and content
  const filteredInfo = unfilteredInfo.filter(obj => {
      switch (type) {
        case "Events":
          var title = obj.title 
          var content = obj.content

          var stringToSearch 
          stringToSearch += title ? title : ""
          stringToSearch += content ? content : ""

          if ( stringToSearch && stringToSearch.toLowerCase().includes(searchText.toLowerCase()) ) {
            return obj;
          }
          break;    
        case "Reminders":
          var title = obj.title 
          var caption = obj.caption

          var stringToSearch 
          stringToSearch += title ? title : ""
          stringToSearch += caption ? caption : ""
          if ( stringToSearch && stringToSearch.toLowerCase().includes(searchText.toLowerCase()) ) {
            return obj;
          }
          break;      
        case "Notify":
            var title = obj.title 
            var caption = obj.caption
  
            var stringToSearch 
            stringToSearch += title ? title : ""
            stringToSearch += caption ? caption : ""
            if ( stringToSearch && stringToSearch.toLowerCase().includes(searchText.toLowerCase()) ) {
              return obj;
            }
            break;     
        default:
          break;
      }

  });

  return {filteredInfo,unfilteredInfo};
}

export function SortInfoBasedOfKey(order, sortBy,info){
  if (!order) {
    order = "Ascending"
  }

  if (!sortBy) {
    return info;
  }

  let property 

  let sortedInfo = info.sort((a,b) => {

    let aValue , bValue
    switch (sortBy) {
      case "Date created":
        property = "created_at"
        aValue = new Date(`${a[property]}`).getTime()
        bValue = new Date(`${b[property]}`).getTime()
        break;
      case "Date modified":
        property = "modified"
        aValue = new Date(`${a[property]}`).getTime()
        bValue = new Date(`${b[property]}`).getTime()
        break;
      case "Alert Date":
        aValue = new Date(`${a.selectDay} 00:00`).getTime()
        bValue = new Date(`${b.selectDay} 00:00`).getTime()
        break;
      case "Title":
        property = "title"
        aValue = a[property]
        bValue = b[property]
        break;
      default:
        break;
    }

    console.log(aValue,bValue);

    if (order === "Ascending") {
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
    }

    if (order === "Descending") {
      if (aValue > bValue) {
        return -1;
      }
      if (aValue < bValue) {
        return 1;
      }
    }

    return 0;



  })


  return sortedInfo;
  

}

export async function fetchImageAsBlob(imageUrl) {
  try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);
      
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Convert the response to a Blob
      const imageBlob = await response.blob();

      // Log or use the Blob as needed
      console.log(imageBlob);
      return imageBlob;
  } catch (error) {
      console.error('Error fetching and converting image to Blob:', error);
  }
}

export async function ConvertImageInfoToDisplay(imageInfo) {
  let displayImage;

  const file = imageInfo;
  const reader = new FileReader();

  await new Promise((resolve, reject) => {
      reader.onload = () => {
          displayImage = reader.result;
          resolve();
      };

      reader.onerror = reject;

      if (file) {
          reader.readAsDataURL(file);
      } else {
          console.log("No file provided");
          reject(false);
      }
  });

  return displayImage;
}

export function SortPastTodayFuture (reminder){

  let past = []
  let today = [];
  let future = [];


  const todaysDate = new Date();
  const year = todaysDate.getFullYear();
  const month = String(todaysDate.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
  const date = String(todaysDate.getDate()).padStart(2, '0'); // Ensure 2 digits

  const formattedDate = `${year}-${month}-${date}`; // e.g., "2024-06-02"


  reminder.forEach(reminderObj => {

    if (formattedDate === reminderObj.selectDay) {
      today.push(reminderObj);
      return;
    } else {
      let todaysDateMill = todaysDate.getTime()
      let objDate = new Date(`${reminderObj.selectDay} 00:00`).getTime()

      if (objDate > todaysDateMill) {
        future.push(reminderObj);
        return;
      }

      if (objDate < todaysDateMill) {
        past.push(reminderObj);
        return;
      }      
    }

    console.log("Sort function: ",reminderObj.selectDay);





  });

  return {past,today,future}

}

export const CheckUserSeen = async () => {
  try {

    // const DBs = ["Event", "Notify", "Seen"]
    // var DBData = {
    //   Event: [],
    //   Notify: [],
    //   Seen: [],
    // }

    // const retrieveUserData = DBs.map(async (dbName) => {
    //   try {
    //     let dbInfo = await DexieGet(dbName)
    //     DBData[dbName] = dbInfo;
    //   } catch (error) {
    //     console.log("Error retriving data from indexedDB");
    //   }
    // })

    // await Promise.all(retrieveUserData);

    // let Event = [];
    // let Notify = [];

    // if ( DBData.Seen.length > 0 ) {

    //   let seenList = [];

    //   DBData.Seen.forEach(seenObj => {
    //     seenList.push(seenObj.systemID)
    //   });

    //   DBData.Event.forEach(eventsObj => {
    //     if (!seenList.includes(eventsObj.systemID)) {
    //       Event.push({...eventsObj, type: "Event"})
    //     }
    //   })

    //   DBData.Notify.forEach(notifyObj => {
    //     if (!seenList.includes(notifyObj.systemID)) {
    //       Notify.push({...notifyObj, type: "Notify"})
    //     }
    //   })      
    // } else {

    //   DBData.Event.forEach(eventsObj => {
    //       Event.push({...eventsObj, type: "Event"})
    //   })

    //   DBData.Notify.forEach(notifyObj => {
    //     Notify.push({...notifyObj, type: "Notify"})
    //   })      
    // }

    // if (Event.length === 0 && Notify.length === 0) {
    //   return false;
    // } else {
    //   return [...Event,...Notify ]
    // }

    


    
  } catch (error) {
    console.log(error);
  }
}

export const DeleteMessageFromLocalStorage = (type, messageID) => {
  // Retrieve all Pending Messages
  var localStoragePendingMessages = JSON.parse(localStorage.getItem('pendingMsg')) || {};

  // Check if there are no pending messages
  if (!localStoragePendingMessages[type]) {
    return;
  }

  const currentTypeMessages = localStoragePendingMessages[type];

  // Check if the specific message exists
  if (currentTypeMessages[messageID]) {
    delete currentTypeMessages[messageID];
  } else {
    return;
  }

  // If there are no more messages of the current type, remove the type key
  if (Object.keys(currentTypeMessages).length === 0) {
    delete localStoragePendingMessages[type];
  } else {
    // Otherwise, update the type messages
    localStoragePendingMessages[type] = currentTypeMessages;
  }

  // Update the Pending Messages in local storage
  localStorage.setItem('pendingMsg', JSON.stringify(localStoragePendingMessages));
  console.log("Deleted pending message", localStoragePendingMessages);
}


export function getBase64Size(base64) {
  base64 = base64.split(',')[1];
  let padding, inBytes, base64StringLength;
  
  if (base64.endsWith('==')) padding = 2;
  else if (base64.endsWith('=')) padding = 1;
  else padding = 0;

  base64StringLength = base64.length;
  inBytes = (base64StringLength / 4) * 3 - padding;

  return inBytes;
}