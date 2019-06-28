export default {
  HOME: {
    route: "/",
    label: "Dashboard"
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
  LOGIN: {
    route: "/login/",
    label: "Login"
  },
  REGISTER: {
    route: "/register/",
    label: "Register"
  }
};
