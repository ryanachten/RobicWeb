export enum Unit {
  kg = "kg"
}

export type Set = {
  reps: number;
  value: number;
};

export type Exercise = {
  id: string;
  date: string;
  definiton: ExerciseDefinition;
  sets: Set[];
  netValue: number;
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
