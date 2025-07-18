
export interface SceneData {
  sceneNumber: number;
  description: string;
  shotType: string;
  characters: string[];
  imagePrompt: string;
}

export interface Scene extends SceneData {
  imageUrl: string;
  notes: string;
}
