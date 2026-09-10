"use client";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Confirm", isPending = false, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full min-w-0 max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 className="break-words text-lg font-bold text-slate-900" id="confirm-title">{title}</h2>
        {message ? <p className="mt-2 break-words text-sm leading-6 text-slate-600">{message}</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-60" disabled={isPending} onClick={onCancel} type="button">Cancel</button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} onClick={onConfirm} type="button">{isPending ? "Deleting..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
