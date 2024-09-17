import dayjs from 'dayjs'


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

export function timeCompare(dateString1, dateString2) {
  // Create Date objects for both times, using a fixed date
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  console.log(date1,"/n", date2,"/n", "Date values");

  // Compare the Date objects directly
  return date1 > date2;
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
  deleteCookie("type")
  deleteCookie("uid")
  localStorage.removeItem("token")
  window.location.href = 'login'
}

function SearchChat (chatInfo, searchText) {

  const filteredMessages = JSON.parse(chatInfo.messages).filter(obj => {
    let chatText = JSON.parse(obj).text
    if (chatText && chatText.toLowerCase().includes(searchText.toLowerCase())) {
      return JSON.stringify(obj);
    }
  });

  return {
      ...chatInfo,
      messages : JSON.stringify(filteredMessages)
  }

}

function SearchUserList (usersInformation, searchText) {
  
  var filteredUsers = {}
  
  Object.values(usersInformation).forEach(userInfo => {
    if (userInfo.name && userInfo.name.toLowerCase().includes(searchText.toLowerCase())) {
      filteredUsers = {
        ...filteredUsers,
        [userInfo.systemID] : userInfo
      }
    }    
  });
  
  return filteredUsers;
}

export function SearchInfoBasedOfType(unfilteredInfo,searchText, type) {
 // Filter the info based of title and content

  // console.log(unfilteredInfo,searchText,type);  
 
  if (type === "Chat") {
    var filteredInfo = SearchChat(unfilteredInfo,searchText);
  } else if (type === "UsersList") {
    var filteredInfo = SearchUserList(unfilteredInfo,searchText)
  }else {
    var filteredInfo = unfilteredInfo.filter(obj => {
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
          case "Chat":
              let chatText = JSON.parse(obj).text
              if (chatText && chatText.toLowerCase().includes(searchText.toLowerCase())) {
                return JSON.stringify(obj);
              }
              
              break;
          default:
            break;
        }

    });    
  }


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

export const CheckEventAndNotifySeen = async (userObject) => {
  let events = userObject && userObject.Event ? userObject.Event : [];
  let notify = userObject && userObject.Notify ? userObject.Notify : [];
  let eventsAndNotifyArr = [...events,...notify];
  let unSeen = false
  
  eventsAndNotifyArr.some(obj => {
    let seen = CheckUserSeen(obj)
    unSeen = !seen 
    return unSeen

  });

  return unSeen;
}


export const CheckUserSeen = (obj) => {
  let type = getCookie("type");
  let uid = getCookie("uid");
  
  let seen = false;
  if (obj.seen) {
    switch (type) {
      case "Admin":
        seen = obj.seen && JSON.parse(obj.seen) && JSON.parse(obj.seen)[uid] ? true : false
        break;
      case "Client":
        seen = obj.seen ? true : false
        break;                    
      default:
        break;
    }
  }
  console.log("Check User Seen",seen,obj.systemID)
  return seen  
}

export const SortEventAndNotifyBasedOfDateCreated = async (userObject) => {
  let events = userObject && userObject.Event ? userObject.Event : [];
  let notify = userObject && userObject.Notify ? userObject.Notify : [];
  let eventsAndNotifyArr = [...events,...notify];
  eventsAndNotifyArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return eventsAndNotifyArr;

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

export function getCookie(cookieName) {
  // Get all cookies from document.cookie
  let cookies = document.cookie.split('; ');
  
  // Loop through all cookies
  for (let cookie of cookies) {
      // Split each cookie into name and value
      let [name, value] = cookie.split('=');
      
      // Check if the current cookie name matches the one we're looking for
      if (name === cookieName) {
          return decodeURIComponent(value); // Return the cookie value after decoding it
      }
  }
  
  // Return null if the cookie is not found
  return null;
}

