export type Web3FormsPayload = Record<string, string | boolean>;

type SubmitOptions = { timeoutMs?: number };

function providerMessage(result: unknown): string | undefined {
  if (!result || typeof result !== "object") return undefined;
  const data = result as { message?: unknown; body?: { message?: unknown } };
  const message = data.message ?? data.body?.message;
  return typeof message === "string" ? message : undefined;
}

/** Browser-to-provider delivery only. No private credentials or automatic retries. */
export async function submitWeb3Forms(payload: Web3FormsPayload, accessKey: string, { timeoutMs = 20000 }: SubmitOptions = {}): Promise<void> {
  if (!accessKey.trim()) throw new Error("The form is not connected yet. Please try again later or email me directly.");
  if (payload.botcheck) throw new Error("Your request could not be sent. Please reload the page and try again.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, access_key: accessKey }),
      signal: controller.signal,
    });
    const result: unknown = await response.json().catch(() => null);
    if (response.status === 429) throw new Error("Too many requests. Please wait a few minutes before trying again.");
    if (!response.ok || !result || typeof result !== "object" || (result as { success?: unknown }).success !== true) {
      throw new Error(providerMessage(result) || "Delivery could not be confirmed. Please try again later or email me directly.");
    }
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Delivery could not be confirmed before the connection timed out. Please wait a moment before trying again, or email me directly.");
    if (error instanceof TypeError) throw new Error("Delivery could not be confirmed. Check your connection before trying again, or email me directly.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
