export type TagDto = {
  id: number;
  name: string;
  color: string;

  // Only set by endpoints that annotate usage
  // TODO: maybe make this generic...? but maybe it's too much of a hassle,
  //  since we'll likely only ever add event_count
  image_count?: number | null;
};
