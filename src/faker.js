import { faker } from '@faker-js/faker';

export function createRandomUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(
      faker.internet.userName(),
    )
  }
  console.log(users);
  return users;
}


export function generateGroups(numGroups, minMembers = 5 , maxMembers = 5) {
  const groups = [];

  for (let i = 0; i < numGroups; i++) {
      const groupName = faker.company.name();
      const numMembers = faker.number.int({ min: minMembers, max: maxMembers });
      const members = [];
      const groupImage = faker.image.url();


      for (let j = 0; j < numMembers; j++) {
          const memberImage = faker.image.url();
          const memberName = faker.person.firstName()
          const description = "Lorem 1111"
          members.push({
            name:memberName,
            image: memberImage,
            description
          });
      }

      groups.push({name:groupName,members,image: groupImage});
  }

  return groups;
}

export function generateMessages(numMessages = 3) {
  const messages = [];
  const users = ['jack_Daniel', 'tori_left4'];
  
  for (let i = 0; i < numMessages; i++) {
      const from = users[i % users.length];
      const replyIndex = i > 0 ? { index: Math.floor(Math.random() * i) } : undefined;
      const images = Array.from({ length: 5 }, () => faker.image.url());
      
      const message = {
          from: from,
          images: images,
          text: faker.lorem.paragraph(),
          date: faker.date.past().toISOString()
      };
      
      if (replyIndex) {
          message.reply = replyIndex;
      }
      
      messages.push(message);
  }

  return messages;
}
