document.getElementById("button").addEventListener("click", () => {
  run(gen).catch(err => alert(err.message));
})

function run(genFunc){
  const genObject = genFunc();

  function iterate(iteration){
    if(iteration.done) return Promise.resolve(iteration.value);
    return Promise.resolve(iteration.value)
              .then(result => iterate(genObject.next(result)))
              .catch(result => iterate(genObject.throw(result)));
  }

  try {
    return iterate(genObject.next());
  } catch (ex){
    return Promise.reject(ex);
  }
}

function *gen(){
  const filmNumber = document.getElementById("input");
  if(filmNumber.value > 7 || filmNumber.value < 1) {
    throw new Error("Invalid Input - Enter a number between 1 and 7");
  }

  const filmResponse = yield fetch("https://swapi.co/api/films/" + filmNumber.value);
  const film = yield filmResponse.json();

  const characters = film.characters;

  let characterString = "Characters: <br>";

  for(let i=0; i < characters.length; i++){
    const tempCharacterResponse = yield fetch(characters[i]);
    const tempCharacter = yield tempCharacterResponse.json();
    characterString += tempCharacter.name + "<br>";
  };

  document.getElementById("filmsText").innerHTML = "Film: <br>" + film.title;
  document.getElementById("peopleText").innerHTML = characterString;
}
