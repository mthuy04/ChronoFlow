type GtagItem = {
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  };
  
  type GtagEventParams = {
    currency?: string;
    value?: number;
    transaction_id?: string;
    payment_type?: string;
    items?: GtagItem[];
  };
  
  declare global {
    interface Window {
      gtag?: (
        command: "event",
        eventName: string,
        params?: GtagEventParams,
      ) => void;
    }
  }
  
  export type EcommerceItem = {
    itemId: string;
    itemName: string;
    itemCategory?: string;
    price: number;
    quantity?: number;
  };
  
  function canTrack() {
    return typeof window !== "undefined" && typeof window.gtag === "function";
  }
  
  function toGa4Item(item: EcommerceItem): GtagItem {
    return {
      item_id: item.itemId,
      item_name: item.itemName,
      item_category: item.itemCategory,
      price: item.price,
      quantity: item.quantity ?? 1,
    };
  }
  
  export function trackViewItem(item: EcommerceItem) {
    if (!canTrack()) return;
  
    window.gtag?.("event", "view_item", {
      currency: "VND",
      value: item.price,
      items: [toGa4Item(item)],
    });
  }
  
  export function trackBeginCheckout(item: EcommerceItem) {
    if (!canTrack()) return;
  
    window.gtag?.("event", "begin_checkout", {
      currency: "VND",
      value: item.price,
      items: [toGa4Item(item)],
    });
  }
  
  export function trackAddPaymentInfo(params: {
    item: EcommerceItem;
    paymentType: string;
  }) {
    if (!canTrack()) return;
  
    window.gtag?.("event", "add_payment_info", {
      currency: "VND",
      value: params.item.price,
      payment_type: params.paymentType,
      items: [toGa4Item(params.item)],
    });
  }
  
  export function trackPurchase(_params: {
    transactionId: string;
    item: EcommerceItem;
  }): void {
    void _params;
  
    // Purchase is tracked server-side only via SePay webhook.
    // Do not send frontend purchase events to avoid duplicate GA4 revenue.
  }