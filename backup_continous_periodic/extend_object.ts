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


/**
In this example:
* We start with an initial person object.
* We define a dateOfBirth variable, which you can set to a date string or undefined to test the conditional logic.
* We use a type assertion (as any) to add the dateOfBirth attribute to the person object if dateOfBirth is defined.
* We log the updated object to the console.
*/
