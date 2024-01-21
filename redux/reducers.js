// reducers.js
const initialState = {
  genInfos: null,
  likearr: null,
  playlistNames: null,
  playlists: [],
  userid: '',
  openList: {},
  token: 'test',
  logged: false,

};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GEN_INFOS':
      return { ...state, genInfos: action.payload };
    case 'SET_LIKEARR':
      return { ...state, likearr: action.payload };
    case 'SET_PLAYLIST_NAMES':
      return { ...state, playlistNames: action.payload };
    case 'SET_PLAYLISTS':
      return { ...state, playlists: action.payload };
    case 'SET_USER_ID':
      return { ...state, userid: action.payload };
    case 'SET_OPEN_LIST':
      return { ...state, openList: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOGGED':
      return { ...state, logged: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
