export enum MuscleGroup {
  CHEST = "chest",
  FOREARMS = "forearms",
  LATS = "lats",
  MIDDLE_BACK = "middle back",
  LOWER_BACK = "lower back",
  NECK = "neck",
  HAMS = "hamstrings",
  QUADS = "quadriceps",
  CALVES = "calves",
  TRICEPS = "triceps",
  TRAPS = "traps",
  SHOULDERS = "shoulders",
  ABS = "abdominals",
  GLUTES = "glutes",
  BICEPS = "biceps",
  ADDUCTORS = "adductors",
  ABDUCTORS = "abductors"
}

export enum Unit {
  kg = "kg",
  min = "min"
}

export type Set = {
  reps: number;
  value: number;
};

export type Exercise = {
  id: string;
  date: string;
  definiton: ExerciseDefinition;
  netValue: number;
  sets: Set[];
  timeTaken: string;
};

export type PersonalBest = {
  netValue: { value: number };
  setCount: { value: number };
  timeTaken: { value: number };
  totalReps: { value: number };
  value: { value: number };
};

export type ExerciseDefinition = {
  history: Exercise[];
  id: string;
  personalBest: PersonalBest;
  title: string;
  unit: Unit;
};

export type User = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};
