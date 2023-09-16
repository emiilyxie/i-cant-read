export async function generateQuiz() {
  // Get the input text
  var text = document.getElementById("inputText").value;

  // Get the quiz div
  var quizDiv = document.getElementById("quiz");

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
  var para = document.createElement("p");
  para.textContent = data;

  // Append the paragraph element to the quiz div
  quizDiv.appendChild(para);
}  

export async function generateImages() {
  console.log("generate images pressed")
  // Get the input text
  var text = document.getElementById("inputText").value;
  var paragraphs = text.split("\n\n")

  // Get the content div
  var contentDiv = document.getElementById("content");

  // Clear the content div
  contentDiv.innerHTML = "";

  // For each paragraph
  for (var i = 0; i < paragraphs.length; i++) {
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
      var para = document.createElement("p");
      para.textContent = paragraphs[i];

      // Append the paragraph element to the content div
      contentDiv.appendChild(para);

      // Create an image element and set its src to the object URL
      var img = document.createElement("img");
      img.src = url;

      // Append the image element to the content div
      contentDiv.appendChild(img);
      
  }
}   