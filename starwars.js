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
