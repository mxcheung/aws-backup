// Define the initial object
const person = {
  name: "Alice",
  age: 25,
  isStudent: true,
};

// Conditionally add a new attribute 'dateOfBirth' if it's defined
const dateOfBirth = "1998-01-01"; // Replace with undefined or a date string to test both cases

if (dateOfBirth) {
  (person as any).dateOfBirth = dateOfBirth;
}

// Log the object to the console
console.log(person);
