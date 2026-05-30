export type PersistenceActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialPersistenceActionState: PersistenceActionState = {
  status: "idle",
  message: ""
};
