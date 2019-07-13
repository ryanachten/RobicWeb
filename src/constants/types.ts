export enum MuscleGroup {
  CHEST = "Chest",
  FOREARMS = "Forearms",
  LATS = "Lats",
  // MIDDLE_BACK = "Middle Back",
  LOWER_BACK = "Lower Back",
  NECK = "Neck",
  HAMS = "Hamstrings",
  QUADS = "Quadriceps",
  CALVES = "Calves",
  TRICEPS = "Triceps",
  TRAPS = "Traps",
  SHOULDERS = "Shoulders",
  ABS = "Abdominals",
  GLUTES = "Glutes",
  BICEPS = "Biceps"
  // ADDUCTORS = "Adductors",
  // ABDUCTORS = "Abductors"
}

export enum Unit {
  kg = "kg",
  min = "min"
}

export type Set = {
  reps: number;
  value: number;
};

export enum ExerciseType {
  CIRCUIT = "Circuit",
  STANDARD = "Standard",
  SUPERSET = "Superset"
}

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
  childExercises?: ExerciseDefinition[];
  history: Exercise[];
  id: string;
  personalBest: PersonalBest;
  primaryMuscleGroup: MuscleGroup[];
  title: string;
  type: ExerciseType;
  unit: Unit;
};

export type User = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};
