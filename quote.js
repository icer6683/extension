var quote;
var author;

async function fetchText() {
  let response = await fetch('https://api.quotable.io/random?maxLength=100');
  console.log(response.statusText);

  if (response.status === 200) {
    let data = await response.json();
    return data;
  } else {
    quote = "Oops. We couldn't fetch quote.";
    return quote;
  }
}

async function getQuote() {
  let quotable = await fetchText();
  quote = quotable.content;
  author = quotable.author;
  console.log(JSON.stringify(quote));
  document.getElementById("quotes").innerHTML = quote + " -- " + author;
}

getQuote();
