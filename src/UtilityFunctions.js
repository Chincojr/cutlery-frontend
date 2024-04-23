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
  if (monthNumber < 1 || monthNumber > 12) {
    return 'Invalid month number';
  }

  // Validate random number
  if (dayNumber < 1) {
    return 'Random number should be greater than 0';
  }

  // Get the month name
  const monthName = months[monthNumber - 1];

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