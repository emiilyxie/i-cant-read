export async function generateQuiz() {
  // Get the input text
  let text = document.getElementById("inputText").value;

  // Get the quiz div
  let quizDiv = document.getElementById("quiz");

  // Clear the quiz div
  quizDiv.innerHTML = "";

  // Make a request to your server
  const response = await fetch("/api/generate-quiz", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          text: text
      })
  });
  
  const data = await response.json();
  
  // Create a new paragraph element and set its text
  let para = document.createElement("p");
  para.textContent = data;

  // Append the paragraph element to the quiz div
  quizDiv.appendChild(para);
}  