export default {
  HOME: {
    route: "/",
    label: "Dashboard"
  },
  LANDING: {
    route: "/",
    label: "Landing"
  },
  EDIT_EXERCISE: (id: string = ":id", label: string = "Edit Exercise") => ({
    label,
    route: `/exercises/edit/${id}`
  }),
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
  ACTIVITY: {
    route: "/activity/",
    label: "Activity"
  },
  LOGIN: {
    route: "/login/",
    label: "Log in"
  },
  REGISTER: {
    route: "/register/",
    label: "Sign up"
  }
};
