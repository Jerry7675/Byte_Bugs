// API layer for wallet endpoints
import { WalletService } from '@/server/services/wallet/wallet.service';
const walletService = new WalletService();

export async function createMockPaymentInitApi(params: any) {
  return walletService.createMockPaymentInit(params);
}
export async function confirmMockPaymentApi(params: any) {
  return walletService.confirmMockPayment(params);
}
export async function failMockPaymentApi(params: any) {
  return walletService.failMockPayment(params);
}
export async function usePointsApi(params: any) {
  return walletService.usePoints(params);
}
export async function getWalletBalanceApi(params: any) {
  return walletService.getWalletBalance(params);
}
export async function getWalletTransactionsApi(params: any) {
  return walletService.getWalletTransactions(params);
}
