const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
const CREATE_USER_ROUTE = `${AUTH_ROUTE}/create-user`;
const GET_CONTACTS = `${AUTH_ROUTE}/get-contacts`;

const ADD_MESSAGE = `${MESSAGES_ROUTE}/add-message`;
const GET_MESSAGES = `${MESSAGES_ROUTE}/get-messages`;


export { HOST, CHECK_USER_ROUTE, CREATE_USER_ROUTE, GET_CONTACTS, ADD_MESSAGE };
