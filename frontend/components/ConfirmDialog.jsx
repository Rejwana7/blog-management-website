"use client";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Confirm", isPending = false, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 className="text-lg font-bold text-slate-900" id="confirm-title">{title}</h2>
        {message ? <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-60" disabled={isPending} onClick={onCancel} type="button">Cancel</button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} onClick={onConfirm} type="button">{isPending ? "Deleting..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
