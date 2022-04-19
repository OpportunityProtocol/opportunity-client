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

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  interface IUserCardProps {
    name: string,
    email: string,
    avatar: string,
    address: string
  }

  export type { Data, HeadCell, TabPanelProps, IUserCardProps }