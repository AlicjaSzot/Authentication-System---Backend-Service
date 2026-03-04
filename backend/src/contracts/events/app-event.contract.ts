import z from "zod";

// 1) ROUTING - stałe do EventBridge Rule (filtrowanie)
export const EVENT_SOURCE = "app.backend" as const;
export const DETAIL_TYPE_SOMETHING_HAPPENED = "SomethingHappened" as const;

// 2) DETAIL - kontrakt danych, które będą w środku eventu
export const AppEventDetailSchema = z.object({
  id: z.string(),
  type: z.string(),
  createdAt: z.string(),
  payload: z.record(z.string(), z.unknown()), //dowolny obiekt
});

export type AppEventDetail = z.infer<typeof AppEventDetailSchema>;

// 3) HELPER - generator poprawnego detail
export function buildSomethingHappenedDetail(
  payload: Record<string, unknown>,
): AppEventDetail {
  return {
    id: crypto.randomUUID(),
    type: DETAIL_TYPE_SOMETHING_HAPPENED,
    createdAt: new Date().toISOString(),
    payload,
  };
}
