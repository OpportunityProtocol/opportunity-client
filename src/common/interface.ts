interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
  }

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
  }

  export type { Data, HeadCell }