function reducer(state = "", action) {
  if(action.type === 'song'){
    return action.desc;
  }
  else if(action.type === 'songName') {
    return action.desc;
  }
  return state;
}

export default reducer;