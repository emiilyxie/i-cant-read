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

export async function generateContent(text) {
  // Get the input text
  let paragraphs = text.split("\n\n")

  // Get the content div
  let contentDiv = document.getElementById("content");

  // Clear the content div
  contentDiv.innerHTML = "";

  // For each paragraph
  for (let i = 0; i < paragraphs.length; i++) {
      // Ignore empty paragraphs
      if (paragraphs[i].trim() === "") continue;

      // Make a request to your server
      const response = await fetch("/api/process-text", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              text: paragraphs[i]
          })
      });

      // Create an object URL for the blob
      const blob = await response.blob();
      console.log(blob)
      const url = URL.createObjectURL(blob);

      // Create a new paragraph element and set its text
      let para = document.createElement("p");
      para.textContent = paragraphs[i];

      // Append the paragraph element to the content div
      contentDiv.appendChild(para);

      // Create an image element and set its src to the object URL
      let img = document.createElement("img");
      img.src = url;

      // Append the image element to the content div
      contentDiv.appendChild(img);
      
  }
}
