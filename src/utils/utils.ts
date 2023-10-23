// generate unique user name
const generateUserName = (meta_name: string = "", email: string = "") => {
    return meta_name !== "" ? meta_name.toLowerCase().split(' ')[0] : email.toLowerCase().split('@')[0].replace(/[^a-zA-Z]/g, "")
}

// generate unique id
const generateUniqueId = () => {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const random = Math.floor(Math.random() * 10000); // Generate a random number
  
    // Combine the timestamp and random number to create a unique ID
    const uniqueId = `${timestamp}${random}`;
  
    return uniqueId;
}



export {generateUserName, generateUniqueId}