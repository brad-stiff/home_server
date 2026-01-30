export type GameTile = {
  id: string;
  title: string
  hex_color: string;
  onPress: () => void;
  component: React.ReactNode;
  icon: string;
  description: string;
};
