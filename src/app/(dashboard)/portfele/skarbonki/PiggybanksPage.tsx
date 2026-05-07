"use client";

import { WalletT } from "@utils/db-actions/wallet";
import { TransactionT } from "@utils/db-actions/transaction";
import { MethodT } from "@utils/db-actions/method";
import WalletsGridLayout from "@components/layouts/WalletsGridLayout";
import PiggybankCard from "@components/features/piggybanks/PiggybankCard";
import { useState, useRef, useEffect } from "react";
import { useData } from "@context/DataContext";
import NewPiggybankForm from "@components/forms/wallets/NewPiggybankForm";
import NewPiggybankDepositForm from "@components/forms/transfers/NewPiggybankDepositForm";
import NewPiggybankWithdrawalForm from "@components/forms/transfers/NewPiggybankWithdrawalForm";
import DeletePiggybankForm from "@components/forms/wallets/DeletePiggybankForm";
import EditPiggybankForm from "@components/forms/wallets/EditPiggybankForm";

export default function PiggybanksPage() {
  const { user, wallets, isReady, transactions, methods, reloadWallets, reloadTransfers } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetWallet, setTargetWallet] = useState<WalletT | null>(null);
  
  const addModalEl = useRef<HTMLDivElement>(null);
  const depositModalEl = useRef<HTMLDivElement>(null);
  const withdrawalModalEl = useRef<HTMLDivElement>(null);
  const editModalEl = useRef<HTMLDivElement>(null);
  const deleteModalEl = useRef<HTMLDivElement>(null);

  const piggybanks = wallets.filter((w) => w.wallet_type_id === 5);
  const totalBalance = piggybanks.reduce((a, b) => a + b.balance, 0);

  // Generic modal animation helper
  const animateModal = (show: boolean, ref: React.RefObject<HTMLDivElement>) => {
    if (show) {
      ref.current?.classList.remove("hidden");
      ref.current?.classList.add("flex");
      setTimeout(() => {
        ref.current?.classList.remove("opacity-0");
      }, 1);
    } else {
      ref.current?.classList.add("opacity-0");
      setTimeout(() => {
        ref.current?.classList.remove("flex");
        ref.current?.classList.add("hidden");
      }, 200);
    }
  };

  useEffect(() => animateModal(showAddModal, addModalEl), [showAddModal]);
  useEffect(() => animateModal(showDepositModal, depositModalEl), [showDepositModal]);
  useEffect(() => animateModal(showWithdrawalModal, withdrawalModalEl), [showWithdrawalModal]);
  useEffect(() => animateModal(showEditModal, editModalEl), [showEditModal]);
  useEffect(() => animateModal(showDeleteModal, deleteModalEl), [showDeleteModal]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    reloadWallets();
  };

  const handleDepositSuccess = () => {
    setShowDepositModal(false);
    setTargetWallet(null);
    reloadWallets();
    reloadTransfers();
  };

  const handleWithdrawalSuccess = () => {
    setShowWithdrawalModal(false);
    setTargetWallet(null);
    reloadWallets();
    reloadTransfers();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setTargetWallet(null);
    reloadWallets();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setTargetWallet(null);
    reloadWallets();
  };

  const handleDeposit = (wallet: WalletT) => {
    setTargetWallet(wallet);
    setShowDepositModal(true);
  };

  const handleWithdrawal = (wallet: WalletT) => {
    setTargetWallet(wallet);
    setShowWithdrawalModal(true);
  };

  const handleEdit = (wallet: WalletT) => {
    setTargetWallet(wallet);
    setShowEditModal(true);
  };

  const handleDelete = (wallet: WalletT) => {
    setTargetWallet(wallet);
    setShowDeleteModal(true);
  };

  // Determine active state for card highlighting
  const getActiveState = (walletId: number): "deposit" | "withdraw" | "edit" | "delete" | null => {
    if (targetWallet?.id !== walletId) return null;
    if (showDepositModal) return "deposit";
    if (showWithdrawalModal) return "withdraw";
    if (showEditModal) return "edit";
    if (showDeleteModal) return "delete";
    return null;
  };

  if (!user) return null;

  return (
    <WalletsGridLayout
      title="skarbonki"
      subtitle="oszczędzaj na swoje marzenia i śledź postępy"
      totalBalance={totalBalance}
      items={piggybanks}
      isReady={isReady}
      colorTheme="tertiary"
      onAdd={() => setShowAddModal(true)}
      renderItem={(wallet) => (
        <PiggybankCard
          key={wallet.id}
          wallet={wallet}
          transactions={transactions.filter((t) => t.wallet_id === wallet.id)}
          transactionsLoading={!isReady}
          onDeposit={() => handleDeposit(wallet)}
          onWithdraw={() => handleWithdrawal(wallet)}
          onEdit={() => handleEdit(wallet)}
          onDelete={() => handleDelete(wallet)}
          activeState={getActiveState(wallet.id)}
        />
      )}
    >
      {/* Add Piggybank Modal */}
      <div
        ref={addModalEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        <NewPiggybankForm 
            userId={user?.id}
            successOperation={handleAddSuccess}
            cancelOperation={() => setShowAddModal(false)}
        />
      </div>

      {/* Deposit Modal */}
      <div
        ref={depositModalEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {targetWallet && showDepositModal && (
          <NewPiggybankDepositForm 
              userId={user?.id}
              wallets={wallets}
              methods={methods}
              targetWallet={targetWallet}
              successOperation={handleDepositSuccess}
              cancelOperation={() => {
                setShowDepositModal(false);
                setTargetWallet(null);
              }}
          />
        )}
      </div>

      {/* Withdrawal Modal */}
      <div
        ref={withdrawalModalEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {targetWallet && showWithdrawalModal && (
          <NewPiggybankWithdrawalForm 
              userId={user?.id}
              wallets={wallets}
              methods={methods}
              sourceWallet={targetWallet}
              successOperation={handleWithdrawalSuccess}
              cancelOperation={() => {
                setShowWithdrawalModal(false);
                setTargetWallet(null);
              }}
          />
        )}
      </div>

      {/* Edit Modal */}
      <div
        ref={editModalEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {targetWallet && showEditModal && (
          <EditPiggybankForm 
              wallet={targetWallet}
              successOperation={handleEditSuccess}
              cancelOperation={() => {
                setShowEditModal(false);
                setTargetWallet(null);
              }}
          />
        )}
      </div>

      {/* Delete Modal */}
      <div
        ref={deleteModalEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {targetWallet && showDeleteModal && (
          <DeletePiggybankForm 
              wallet={targetWallet}
              successOperation={handleDeleteSuccess}
              cancelOperation={() => {
                setShowDeleteModal(false);
                setTargetWallet(null);
              }}
          />
        )}
      </div>
    </WalletsGridLayout>
  );
}
