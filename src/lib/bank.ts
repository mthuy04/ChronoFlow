export function createTransferCode(itemKey: string) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `CF ${itemKey.toUpperCase()} ${random}`;
  }
  
  export function createVietQrUrl({
    bankId,
    accountNo,
    accountName,
    amount,
    transferCode,
  }: {
    bankId: string;
    accountNo: string;
    accountName: string;
    amount: number;
    transferCode: string;
  }) {
    const base = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png`;
  
    const params = new URLSearchParams({
      amount: String(amount),
      addInfo: transferCode,
      accountName,
    });
  
    return `${base}?${params.toString()}`;
  }