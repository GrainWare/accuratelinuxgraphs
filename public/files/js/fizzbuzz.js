function changeInnerText(id, text) {
  const place = document.getElementById(`${id}`);
  text = text.replace(/ /g, "&nbsp;");
  place.innerHTML = text.replace(/\n/g, "<br>");
}

function generateFizzbuzz() {
  const inputNumber = document.getElementById("number").value;
  const language = document.getElementById("language").value;

  const fizzbuzzArray = [];
  for (let i = 1; i <= inputNumber; i++) {
    if (i % 15 === 0) {
      fizzbuzzArray.push("FizzBuzz");
    } else if (i % 3 === 0) {
      fizzbuzzArray.push("Fizz");
    } else if (i % 5 === 0) {
      fizzbuzzArray.push("Buzz");
    } else {
      fizzbuzzArray.push(i.toString());
    }
  }

  let fizzbuzzString = "";
  if (language === "python") {
    fizzbuzzString = fizzbuzzArray
      .map((element) => `print('${element}')`)
      .join("\n");
  } else if (language === "rust") {
    fizzbuzzString = `fn main() {\n${fizzbuzzArray.map((element) => `    println!("${element}");`).join("\n")}\n}`;
  } else {
    fizzbuzzString = "why";
  }
  console.log(fizzbuzzString);

  changeInnerText("codeBlock", fizzbuzzString);
}

function downloadFizzbuzz() {
  const code = document.getElementById("codeBlock").innerText;
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fizzbuzz.txt";
  a.click();
  URL.revokeObjectURL(url);
}
