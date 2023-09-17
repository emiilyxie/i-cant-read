export function saveText(text) {
    console.log("saving text ?")
    fetch("/api/save-text", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    });
}

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

export async function getImage(text) {

      // Make a request to your server
      const response = await fetch("/api/get-image", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              text: text
          })
      });

      // Create an object URL for the blob
      const blob = await response.blob();
      console.log(blob)
      const url = URL.createObjectURL(blob);

      return url
}
