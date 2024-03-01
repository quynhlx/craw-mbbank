export class TransactionRequest {
    accountNo: string;
    fromDate: string;
    toDate: string;
    historyNumber: string;
    historyType: 'DATE_RANGE';
    type: 'ACCOUNT';
    sessionId: string;
    refNo: string;
    deviceIdCommon: string;
}