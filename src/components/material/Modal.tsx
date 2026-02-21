import React, { useEffect, useRef } from "react";

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    if (!open) return null;

    // Use portal if possible to avoid z-index issues, but mostly optional in simple app
    // For now simpler direct rendering, or ensure dialog is top level
    return (
        <dialog
            ref={dialogRef}
            className="bg-surface-container-high text-on-surface p-0 rounded-xl shadow-xl backdrop:bg-black/50"
            onClick={handleBackdropClick}
            onCancel={onClose}
        >
            <div className="p-4 bg-surface-container-high rounded-xl">
                {children}
            </div>
        </dialog>
    );
}
