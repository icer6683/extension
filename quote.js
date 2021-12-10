var quote;
var author;

async function fetchText() {
  let response = await fetch('https://api.quotable.io/random?maxLength=100');
  console.log(response.statusText);

  if (response.status === 200) {
    let data = await response.json();
    quote = data.content;
    author = data.author;
    console.log(typeof quote);
    console.log(JSON.stringify(quote));
  } else {
    quote = "Oops. We couldn't fetch quote.";
  }
}
fetchText();
