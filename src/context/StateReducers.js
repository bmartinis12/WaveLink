import { reducerCase } from "./constants";

export const initialState = {
    userInfo: undefined,
    newUser: false,
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    messageSearch: false,
    onlineUsers: [],
    userContacts: [],
    filteredContacts: [],
    contactSearch: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case reducerCase.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            };
        case reducerCase.SET_NEW_USER:
            return {
                ...state,
                newUser: action.newUser
            };
        case reducerCase.SET_ALL_CONTACTS_PAGE:
            return {
                ...state,
                contactsPage: !state.contactsPage
            };
        case reducerCase.CHANGE_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser: action.user,
            };
        case reducerCase.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };
        case reducerCase.SET_SOCKET:
            return {
                ...state,
                socket: action.socket,
            };
        case reducerCase.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.newMessage]
            };
        case reducerCase.SET_MESSAGE_SEARCH:
            return {
                ...state,
                messageSearch: !state.messageSearch
            };
        case reducerCase.SET_USERS_CONTACTS:
            return {
                ...state,
                userContacts: action.userContacts
            };
        case reducerCase.SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            };
        case reducerCase.SET_CONTACT_SEARCH: {
            const filteredContacts = state.userContacts.filter((contact) => contact.name.toLowerCase().includes(action.contactSearch.toLowerCase()));
            return {
                ...state,
                contactSearch: action.contactSearch,
                filteredContacts
            }
        };
        case reducerCase.SET_EXIT_CHAT:
            return {
                ...state,
                currentChatUser: undefined
            };
        default:
            return state;
    }
};

export default reducer