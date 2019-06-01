enum Unit {
  kg = "kg"
}

export type PersonalBest = {
  netValue: { value: number };
  setCount: { value: number };
  timeTaken: { value: number };
  totalReps: { value: number };
  value: { value: number };
};

export type ExerciseDefinition = {
  history: [];
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
