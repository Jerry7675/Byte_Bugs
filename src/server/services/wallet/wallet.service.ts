// Wallet service stub for all wallet/points logic
import { getContext } from '@/context/context-store';
import { PointsTxType } from '@/lib/prisma.type';

export class WalletService {
  /**
   * Initiate a mock payment: create a pending credit transaction with a mock reference.
   * @param params { userId: string, amount: number }
   */
  async createMockPaymentInit(params: { userId: string; amount: number }) {
    const { userId, amount } = params;
    if (!userId || !amount || amount <= 0) throw new Error('Invalid userId or amount');
    const { prisma } = getContext();

    //Find or create wallet
    let wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.pointsWallet.create({ data: { userId, balance: 0 } });
    }

    //Create pending transaction
    const reference = `MOCK_TXN_${crypto.randomUUID()} `;
    const transaction = await prisma.pointsTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: PointsTxType.PURCHASE,
        reference,
        note: 'Mock payment initiated',
        status: 'pending',
      },
    });

    return {
      status: transaction.status,
      transactionId: transaction.id,
      reference,
      amount,
      walletId: wallet.id,
      createdAt: transaction.createdAt,
    };
  }
  /**
   * Confirm a mock payment: atomically credit wallet if transaction is pending.
   * @param params { transactionId?: string, reference?: string }
   */
  async confirmMockPayment(params: { transactionId?: string; reference?: string }) {
    const { transactionId, reference } = params;
    if (!transactionId && !reference) throw new Error('transactionId or reference required');
    const { prisma } = getContext();

    const transaction = await prisma.pointsTransaction.findFirst({
      where: {
        ...(transactionId ? { id: transactionId } : {}),
        ...(reference ? { reference } : {}),
      },
    });
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'pending') throw new Error('Transaction not pending');

    //Lock wallet row for update
    const wallet = await prisma.pointsWallet.findUnique({ where: { id: transaction.walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance + transaction.amount;

    //Update wallet balance
    await prisma.pointsWallet.update({
      where: { id: wallet.id },
      data: { balance: balanceAfter },
    });

    //Update transaction: mark as success, store before/after
    const updatedTx = await prisma.pointsTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'success',
        note: 'Mock payment confirmed',
        balanceBefore,
        balanceAfter,
      },
    });

    return {
      status: updatedTx.status,
      transactionId: updatedTx.id,
      reference: updatedTx.reference,
      amount: updatedTx.amount,
      walletId: wallet.id,
      balanceBefore,
      balanceAfter,
      confirmedAt: updatedTx.createdAt,
    };
  }
  /**
   * Mark a mock payment as failed (never delete, never mutate balances directly).
   * @param params { transactionId?: string, reference?: string }
   */
  async failMockPayment(params: { transactionId?: string; reference?: string }) {
    const { transactionId, reference } = params;
    if (!transactionId && !reference) throw new Error('transactionId or reference required');
    const { prisma } = getContext();

    //Find transaction by id or reference
    const transaction = await prisma.pointsTransaction.findFirst({
      where: {
        ...(transactionId ? { id: transactionId } : {}),
        ...(reference ? { reference } : {}),
      },
    });
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'pending') throw new Error('Transaction not pending');

    //Mark as failed (never delete, never edit balances)
    const failedTx = await prisma.pointsTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'failed',
        note: 'Mock payment failed',
      },
    });

    return {
      status: failedTx.status,
      transactionId: failedTx.id,
      reference: failedTx.reference,
      amount: failedTx.amount,
      walletId: failedTx.walletId,
      failedAt: failedTx.createdAt,
    };
  }
  /**
   * Use points (debit): validate balance, create pending debit, atomically apply debit, mark as success.
   * @param params { userId: string, amount: number, usageContext?: string }
   */
  async usePoints(params: { userId: string; amount: number; usageContext?: string }) {
    const { userId, amount, usageContext } = params;
    if (!userId || !amount || amount <= 0) throw new Error('Invalid userId or amount');
    const { prisma } = getContext();

    return await prisma.$transaction(async (tx) => {
      //Find wallet
      const wallet = await tx.pointsWallet.findUnique({ where: { userId } });
      if (!wallet) throw new Error('Wallet not found');
      if (wallet.balance < amount) throw new Error('Insufficient balance');

      //Create pending debit transaction
      const reference = `DEBIT_TXN_${crypto.randomUUID()} `;
      const pendingTx = await tx.pointsTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          type: PointsTxType.SPEND,
          reference,
          note: usageContext ? `Usage: ${usageContext}` : 'Points usage',
          status: 'pending',
        },
      });

      const balanceBefore = wallet.balance;
      const balanceAfter = wallet.balance - amount;
      await tx.pointsWallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      //Update transaction: mark as success, store before/after
      const updatedTx = await tx.pointsTransaction.update({
        where: { id: pendingTx.id },
        data: {
          status: 'success',
          note: (pendingTx.note || '') + '|Debit applied',
          balanceBefore,
          balanceAfter,
        },
      });

      return {
        status: updatedTx.status,
        transactionId: updatedTx.id,
        reference: updatedTx.reference,
        amount: updatedTx.amount,
        walletId: wallet.id,
        balanceBefore,
        balanceAfter,
        usedAt: updatedTx.createdAt,
      };
    });
  }
  /**
   * Get current wallet balance for a user.
   * @param params { userId: string }
   */
  async getWalletBalance(params: { userId: string }) {
    const { userId } = params;
    if (!userId) throw new Error('userId required');
    const { prisma } = getContext();
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');
    return { userId, balance: wallet.balance };
  }

  /**
   * Get wallet transactions for a user, with optional filters.
   * @param params { userId: string, type?: string, date?: string, source?: string }
   */
  async getWalletTransactions(params: {
    userId: string;
    type?: string;
    date?: string;
    source?: string;
  }) {
    const { userId, type, date, source } = params;
    if (!userId) throw new Error('userId required');
    const { prisma } = getContext();
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    // Build filters
    const filters: any = { walletId: wallet.id };
    if (type) filters.type = type;
    if (date) {
      // Filter by date (YYYY-MM-DD)
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filters.createdAt = { gte: start, lt: end };
    }
    if (source) filters.note = { contains: source };

    const transactions = await prisma.pointsTransaction.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  }
}
