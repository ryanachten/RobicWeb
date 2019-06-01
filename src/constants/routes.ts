export default {
  HOME: {
    route: "/",
    label: "Dashboard"
  },
  EXERCISES: {
    route: "/exercises/",
    label: "Exercises"
  },
  EXERCISE: (id: string = ":id", label: string = "Exercise") => ({
    label,
    route: `/exercises/${id}`
  }),
  NEW_EXERCISE: {
    route: "/exercises/new/",
    label: "New Exercise"
  },
  HISTORY: {
    route: "/history/",
    label: "History"
  },
  LOGIN: {
    route: "/login/",
    label: "Login"
  }
};
