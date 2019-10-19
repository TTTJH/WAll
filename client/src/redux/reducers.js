import {combineReducers} from 'redux';

import {
  ACCOUNT_SUCCESS,
  ACCOUNT_ERROR,
  ACCOUNT_CLEAR,
  RECOMMEND_ERROR,
  RECOMMEND_SUCCESS,
  RECOMMEND_CLEAR,
  NOTE_ERROR,
  NOTE_SUCCESS,
  GET_NOTES_ERROR,
  GET_NOTES_SUCCESS,
  USER_ERROR,
  USER_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_SUCCESS,
  GET_USERS2_SUCCESS,
  GET_USERS2_ERROR,
  GET_CARDS_SUCCESS,
  GET_CARDS_ERROR,
  GET_CARD_SUCCESS,
  GET_CARD_ERROR,
  COMMENT_ERROR,
  COMMENT_SUCCESS,
  GET_COMMENTS_ERROR,
  GET_COMMENTS_SUCCESS,
} from './action-types';

const initUser = {
  nickName:"",
  username:"",
  sex:"",
  tags:[],
  follow:[],
  notes:[],
}

const initRecommend = [];

function user(state = initUser, action){
  switch(action.type){
    case ACCOUNT_SUCCESS : {
      return action.data
    }
    case ACCOUNT_ERROR : {
      return {...state, msg:action.data}
    }
    case ACCOUNT_CLEAR : {
      return initUser;
    }
    default :
      return state;
  }
}

function recommend(state = initRecommend, action){
  switch(action.type){
    case RECOMMEND_SUCCESS : {
      return action.data;
    }
    case RECOMMEND_ERROR : {
      return {msg:action.data}
    }
    case RECOMMEND_CLEAR : {
      return [];
    }
    default:
      return state;
  }
}

const initNote = {
  from_id:"",
  data:"",
  avatar_url:"",
  imgs_url:[],
  content:"",
  like:[],
  comment:[],
  share:""
}

function note(state = initNote, action){
  switch(action.type){
    case NOTE_SUCCESS : {
      return {state,...action.data}
    }
    case NOTE_ERROR : {
      return {state,msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initNotes = {
  imgs_url:"",
  comment:"",
  _id:"",
  from_id:"",
  date:"",
  content:"",
  like:[],
  share:"",
}

function notes(state = [], action){
  switch(action.type){
    case GET_NOTES_SUCCESS : {
      return action.data;
    }
    case GET_NOTES_ERROR : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initOtherUser = {};

function otherUser(state = initOtherUser, action){
  switch(action.type){
    case USER_SUCCESS : {
      return action.data;
    }
    case USER_SUCCESS : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initUsersObjs = [];

function usersObjs(state = initUsersObjs, action){
  switch(action.type){
    case GET_USERS_SUCCESS : {
      return action.data;
    }
    case GET_USERS_ERROR : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initUsers2Objs = [];

function users2Objs(state = initUsers2Objs, action){
  switch(action.type){
    case GET_USERS2_SUCCESS : {
      return action.data;
    }
    case GET_USERS2_ERROR : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initCards = [];
function cardsObjs(state = initCards, action){
  switch(action.type){
    case GET_CARDS_SUCCESS : {
      return action.data;
    }
    case GET_CARDS_ERROR : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initCard = {};
function cardObj(state = initCard, action){
  switch(action.type){
    case GET_CARD_SUCCESS : {
      return action.data;
    }
    case GET_CARD_ERROR : {
      return {msg:action.data}
    }
    default : {
      return state;
    }
  }
}

const initCommentStatus = {};
function comment(state = initComments, action){
  switch(action.type) {
    case  COMMENT_SUCCESS: {
      return action.data;
    }
    case COMMENT_ERROR : {
      return {msg:action.data};
    }
    default:{
      return state;
    }
  }
}

const initComments = [];
function comments(state = initComments, action){
  switch(action.type) {
    case GET_COMMENTS_SUCCESS: {
      return action.data;
    }
    case GET_COMMENTS_ERROR : {
      return {msg:action.data};
    }
    default:{
      return state;
    }
  }
}


export default combineReducers({
  user,
  recommend,
  note,
  notes,
  otherUser,
  usersObjs,
  users2Objs,
  cardsObjs,
  cardObj,
  comment,
  comments
});