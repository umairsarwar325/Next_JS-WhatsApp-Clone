const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
const CREATE_USER_ROUTE = `${AUTH_ROUTE}/create-user`;
const GET_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`;

const ADD_MESSAGE = `${MESSAGES_ROUTE}/add-message`;
const ADD_IMAGE_MESSAGE = `${MESSAGES_ROUTE}/add-image-message`;
const ADD_AUDIO_MESSAGE = `${MESSAGES_ROUTE}/add-audio-message`;
const GET_MESSAGES = `${MESSAGES_ROUTE}/get-messages`;
const GET_INITIAL_CONTACTS = `${MESSAGES_ROUTE}/get-initial-contacts`;

export {
  HOST,
  CHECK_USER_ROUTE,
  CREATE_USER_ROUTE,
  GET_CONTACTS,
  ADD_MESSAGE,
  ADD_IMAGE_MESSAGE,
  GET_MESSAGES,
  ADD_AUDIO_MESSAGE,
  GET_INITIAL_CONTACTS,
  GET_CALL_TOKEN,
};
