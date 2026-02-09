export const customScrollbar = {
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "background.paper",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "action.disabled",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "action.active",
    },
  },

};