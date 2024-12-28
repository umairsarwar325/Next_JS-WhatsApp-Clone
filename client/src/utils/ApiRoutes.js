const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;

const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
const CREATE_USER_ROUTE = `${AUTH_ROUTE}/create-user`;
const GET_CONTACTS = `${AUTH_ROUTE}/get-contacts`;

export { HOST, CHECK_USER_ROUTE, CREATE_USER_ROUTE,GET_CONTACTS };
