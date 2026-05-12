type Ga4ServerItem = {
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  };
  
  type SendGa4PurchaseInput = {
    transactionId: string;
    userId?: string | null;
    value: number;
    currency?: string | null;
    items: Ga4ServerItem[];
  };
  
  type Ga4MeasurementPayload = {
    client_id: string;
    user_id?: string;
    events: Array<{
      name: "purchase";
      params: {
        transaction_id: string;
        value: number;
        currency: string;
        items: Ga4ServerItem[];
        engagement_time_msec: number;
      };
    }>;
  };
  
  function buildStableClientId(input: {
    userId?: string | null;
    transactionId: string;
  }) {
    const source = input.userId ?? input.transactionId;
    let hash = 0;
  
    for (let index = 0; index < source.length; index += 1) {
      hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
    }
  
    return `${hash || 1}.${Math.floor(Date.now() / 1000)}`;
  }
  
  export async function sendGa4PurchaseEvent(input: SendGa4PurchaseInput) {
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
  
    if (!measurementId || !apiSecret) {
      console.warn("[GA4_SERVER_SKIP]", {
        reason: "Missing GA4_MEASUREMENT_ID or GA4_API_SECRET.",
        hasMeasurementId: Boolean(measurementId),
        hasApiSecret: Boolean(apiSecret),
        transactionId: input.transactionId,
      });
  
      return;
    }
  
    const payload: Ga4MeasurementPayload = {
      client_id: buildStableClientId({
        userId: input.userId,
        transactionId: input.transactionId,
      }),
      events: [
        {
          name: "purchase",
          params: {
            transaction_id: input.transactionId,
            value: input.value,
            currency: input.currency ?? "VND",
            items: input.items,
            engagement_time_msec: 100,
          },
        },
      ],
    };
  
    if (input.userId) {
      payload.user_id = input.userId;
    }
  
    const endpoint = new URL("https://www.google-analytics.com/mp/collect");
    endpoint.searchParams.set("measurement_id", measurementId);
    endpoint.searchParams.set("api_secret", apiSecret);
  
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      const body = await response.text().catch(() => "");
  
      console.error("[GA4_SERVER_PURCHASE_FAILED]", {
        status: response.status,
        statusText: response.statusText,
        body,
        transactionId: input.transactionId,
      });
  
      return;
    }
  
    console.log("[GA4_SERVER_PURCHASE_SENT]", {
      transactionId: input.transactionId,
      value: input.value,
      currency: input.currency ?? "VND",
      items: input.items.length,
    });
  }