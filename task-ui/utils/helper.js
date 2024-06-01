import { LocalStorageService } from "@/services/localStorage.service";

export const BASE_URL = "http://localhost:3000";
const ISSERVER = typeof window === "undefined";

export function getHeaders(method = "GET") {
  let token;
  if (!ISSERVER) {
    token = LocalStorageService.getItem('token');
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

export async function customFetch(url, method = "GET", data = {}) {
  const obj = {};
  if (method !== "GET") {
    obj["body"] = JSON.stringify(data);
  }
  const res = await fetch(`${BASE_URL}${url}`, {
    ...getHeaders(method),
    ...obj,
  });
  const res_1 = await res.json();
  return res_1;
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
