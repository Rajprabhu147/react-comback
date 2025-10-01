var name = "Raj";
name = "Prabhu";
console.log(name);

///1. Hoisting Pitfalls Illustrated with examples

console.log(variable);
var variable = "25"; //undefined

let variable = "35"; //Reference Error

const variable = "1"; //REference Error

Now;
console.log(name); // Reference Error cannot access before initialization
let name = "prabhu"; // prabhu
name = "Raj Prabhu";
console.log(name); // Raj Prabhu

console.log(age); // Reference Error cannot access before Initialization
const age = 19;
age = 35; // TypeError Assignment to a const variable
console.log(age);

///2. functions

///Traditional functions

function add(a, b) {
  return a + b;
}
console.log(add(2, 3));

///Arrow function

const addition = (a, b) => a + b;
console.log(addition(12, 28));

const subtraction = (c, d) => c - d;
console.log(subtraction(20, 10));

const percentage = (e, f) => {
  const result = ((e + f) / 100) * 100;
  return result; // without return is is undefined
};
console.log(percentage(40, 30)); // 70

///3. Destructing

const Raj = { id: 1, name: "Rajprabhu", age: 35 };
console.log(name); // cannot access name
console.log(Raj.name); // Rajprabhu
const { name, age } = Raj; // art of destructing
console.log(age); // now can easily access - 35

///4.  Spread and Merge Arrays

const a = [" apple", "orange"];
const b = ["carrot", "beans"];
const food = [...a, ...b];
console.log(a);
console.log(b);
console.log(food);
const newFood = ["tomato", ...food];
console.log(newFood);
const copyA = [...a];
console.log(copyA);
const duplicate = [...a, ...b, ...food, ...newFood, ...copyA];
console.log(duplicate);
const cleanFood = [...new Set(duplicate)];
console.log(cleanFood);
const number = [1, 2, 3, 4, 5];
const math = Math.max(...number);
console.log(math);

///5. Rest parameters
function sum(...numbers) {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}
console.log(sum(1, 2, 3, 4, 5, 21, 24123, 12432412324213, 6));
console.log(sum());

///6. Map method
const a1 = [1, 2, 3, 4];
const a2 = a1.map((no) => no + no);
console.log(a1); // [1,2,3,4] old array is unchanged
console.log(a2); // [2,4,6,8] new array is formed with the map and is transforming callback function

///7. Filter method
const b1 = [1, 2, 3];
const b2 = b1.filter((no) => no > 2);
console.log(b2); // [3]
console.log(b1); // [1,2,3]

const products = [
  { name: "Laptop", price: 800, category: "Electronics" },
  { name: "T-shirt", price: 20, category: "Clothing" },
  { name: "Coffee Maker", price: 50, category: "Kitchen" },
  { name: "Headphones", price: 150, category: "Electronics" },
];

function filterProducts(products, maxPrice, category) {
  return products.filter((product) => {
    return product.price <= maxPrice && product.category === category;
  });
}

const filtered = filterProducts(products, 800, "Electronics");
console.log(filtered); // [{}, {}] two object in jason

///8. Reduce method
const nos = [1, 2, 3, 4];
const sum = nos.reduce((acc, curr) => acc + curr, 0);
const sub = nos.reduce((acc, curr) => acc - curr, 0);
console.log(sum); // 10
console.log(sub); // -10

const evens = nos.reduce((acc, n) => acc + n, 0);
console.log(evens); // 10

// 9. Async/await
async function getData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    const posts = await response.json();

    const firstTitle = posts[0].title;

    console.log("First Post Title: ", firstTitle);
    return firstTitle;
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
}
getData();

