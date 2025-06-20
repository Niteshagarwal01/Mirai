// Debug script to log app initialization
console.log("App is initializing...");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const root = document.getElementById("root");
  console.log("Root element found:", !!root);
});
