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
    route: "/exercises/create/",
    label: "Create Exercise"
  },
  HISTORY: {
    route: "/activity/",
    label: "Activity"
  },
  LOGIN: {
    route: "/login/",
    label: "Login"
  }
};
