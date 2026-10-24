const spaces = await listTaskSpaces();
console.log(spaces.map(({id, name, ownership}) => ({id, name, ownership})));
