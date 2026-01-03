const initialState = {
  isSidebarOpen: true,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case "ui/toggleSidebar":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    default:
      return state;
  }
}

export const toggleSidebar = () => ({ type: "ui/toggleSidebar" }); 
