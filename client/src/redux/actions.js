import {
  ACCOUNT_ERROR,
  ACCOUNT_SUCCESS,
  ACCOUNT_CLEAR,
  RECOMMEND_ERROR,
  RECOMMEND_SUCCESS,
  RECOMMEND_CLEAR,
  NOTE_ERROR,
  NOTE_SUCCESS,
  GET_NOTES_SUCCESS,
  GET_NOTES_ERROR,
  USER_ERROR,
  USER_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_SUCCESS,
  GET_USERS2_ERROR,
  GET_USERS2_SUCCESS,
  GET_CARDS_ERROR,
  GET_CARDS_SUCCESS,
  GET_CARD_ERROR,
  GET_CARD_SUCCESS,
  COMMENT_ERROR,
  COMMENT_SUCCESS,
  GET_COMMENTS_ERROR,
  GET_COMMENTS_SUCCESS,

} from './action-types'

import {
  reqRegister,
  reqLogin,
  reqAutoLogin,
  reqRecommend,
  reqNote,
  reqNotes,
  reqAddTag,
  reqRemoveTag,
  reqUser,
  reqFollow,
  reqUnFollow,
  reqUsersObjs,
  reqUsers2Objs,
  reqCards,
  reqCard,
  reqComment,
  reqComments,
} from '../api/index'

// 同步actions
const account_success = (data) => ({type:ACCOUNT_SUCCESS, data});
const account_error = (data) => ({type:ACCOUNT_ERROR, data});
export const account_clear = () => ({type:ACCOUNT_CLEAR});
const recommend_success = (data) => ({type:RECOMMEND_SUCCESS, data});
const recommend_error = (data) => ({type:RECOMMEND_ERROR, data});
export const recommend_clear = () => ({type:RECOMMEND_CLEAR});
const note_success = (data) => ({type:NOTE_SUCCESS, data});
const note_error = (data) => ({type:NOTE_ERROR, data});
const get_note_success = (data) => ({type:GET_NOTES_SUCCESS,data});
const get_note_error = (data) => ({type:GET_NOTES_ERROR, data});
const user_succrss = (data) => ({type:USER_SUCCESS,data});
const user_error = (data) => ({type:USER_ERROR, data});
const get_users_success = (data) => ({type:GET_USERS_SUCCESS,data});
const get_users_error = (data) => ({type:GET_USERS_ERROR, data});
const get_users2_success = (data) => ({type:GET_USERS2_SUCCESS,data});
const get_users2_error = (data) => ({type:GET_USERS2_ERROR, data});
const get_cards_success = (data) => ({type:GET_CARDS_SUCCESS,data});
const get_cards_error = (data) => ({type:GET_CARDS_ERROR, data});
const get_card_success = (data) => ({type:GET_CARD_SUCCESS,data});
const get_card_error = (data) => ({type:GET_CARDS_ERROR, data});
const comment_success = (data) => ({type:COMMENT_SUCCESS,data});
const comment_error = (data) => ({type:COMMENT_ERROR, data});
const get_comments_success = (data) => ({type:GET_COMMENTS_SUCCESS, data});
const get_comments_error = (data) => ({type:GET_COMMENTS_ERROR, data});

// 异步actions
export const register = (obj) => {
  console.log(obj);
  return async (dispatch) => {
    const result = await reqRegister(obj);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const login = (obj) => {
  return async (dispatch) => {
    const result = await reqLogin(obj);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const autoLogin = () => {
    return async (dispatch) => {
      const result = await reqAutoLogin();
      if(result.code === 1){
        dispatch(account_success(result.data));
      }else{
        dispatch(account_error(result.data));
      }
    }
}

export const recommend = () => {
  return async (dispatch) => {
    const result = await reqRecommend();
    if(result.code === 1){
      dispatch(recommend_success(result.data));
    }else{
      dispatch(recommend_error(result.data));
    }
  }
}

export const note = (obj) => {
  return async (dispatch) => {
    const result = await reqNote(obj);
    if(result.code === 1){
      dispatch(note_success(result.data));
    }else{
      dispatch(note_error(result.data));
    }
  }
}

export const getNotes  = () => {
  return async (dispatch) => {
    const result = await reqNotes();
    if(result.code === 1){
      dispatch(get_note_success(result.data));
    }else{
      dispatch(get_note_error(result.data));
    }
  }
}

export const addTag = (tag) => {
  return async (dispatch) => {
    const result = await reqAddTag(tag);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const removeTag = (tag) => {
  return async (dispatch) => {
    const result = await reqRemoveTag(tag);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const getUser = (_id) => {
  return async dispatch => {
    const result = await reqUser(_id);
    if(result.code === 1){
      dispatch(user_succrss(result.data));
    }else{
      dispatch(user_error(result.data));
    }
  }
}

export const follow = (follow_id) => {
  return async dispatch => {
    const result = await reqFollow(follow_id);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const unFollow = (unFollow_id) => {
  return async dispatch => {
    const result = await reqUnFollow(unFollow_id);
    if(result.code === 1){
      dispatch(account_success(result.data));
    }else{
      dispatch(account_error(result.data));
    }
  }
}

export const getUsersObjs = (_id) => {
  return async dispatch => {
    const result = await reqUsersObjs(_id);
    if(result.code === 1){
      dispatch(get_users_success(result.data));
    }else{
      dispatch(get_users_error(result.data));
    }
  }
}

export const getUsers2Objs = (_id) => {
  return async dispatch => {
    const result = await reqUsers2Objs(_id);
    if(result.code === 1){
      dispatch(get_users2_success(result.data));
    }else{
      dispatch(get_users2_error(result.data));
    }
  }
}

export const getCardsObjs = (_id) => {
  return async dispatch => {
    const result = await reqCards(_id);
    if(result.code === 1){
      dispatch(get_cards_success(result.data));
    }else{
      dispatch(get_cards_error(result.data));
    }
  }
}

export const getCardObj = (_id) => {
  return async dispatch => {
    const result = await reqCard(_id);
    if(result.code === 1){
      dispatch(get_card_success(result.data));
    }else{
      dispatch(get_card_error(result.data));
    }
  }
}

export const comment = (obj) => {
  return async dispatch => {
    const result = await reqComment(obj);
    if(result.code === 1){
      dispatch(comment_success(result.data));
    }else{
      dispatch(comment_error(result.data));
    }
  }
}

export const comments = (note_id) => {
  return async dispatch => {
    const result = await reqComments(note_id);
    if(result.code === 1){
      dispatch(get_comments_success(result.data));
    }else{
      dispatch(get_comments_error(result.data));
    }
  }
}