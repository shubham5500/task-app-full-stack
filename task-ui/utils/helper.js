export const BASE_URL = "http://localhost:3000";
const ISSERVER = typeof window === "undefined";

export function getHeaders(method = "GET") {
  let token = '';
  if (!ISSERVER) {
    // Access localStorage
    token = localStorage.getItem("myToken") || "";
  }
  return {
    method,
    headers: {
      "auth-token": token,
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
}

export function customFetch(url, method = "GET", data = {}) {
  const obj = {};
  if (method !== "GET") {
    obj["body"] = JSON.stringify(data);
  }
  return fetch(`${BASE_URL}${url}`, {
    ...getHeaders(method),
    ...obj,
  })
    .then((res) => res.json())
    .then((res) => res);
}


const borderColors = [
  'border-red-500',
  'border-green-500',
  'border-blue-500',
  'border-pink-500',
  'border-teal-500',
];

const backgroundColors = [
  'bg-red-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-teal-500',
];

const textColors = [
  'text-white',
  'text-gray-100',
  'text-gray-200',
  'text-gray-300',
  'text-gray-400',
];

export const getRandomClass = (type) => {
  let x;
  if (type === 'border') {
    x = borderColors;
  } else if (type === 'bg') {
    x = backgroundColors;
  } else if (type === 'text') {
    x = textColors;
  }
  return x[Math.floor(Math.random() * x.length)];
};
