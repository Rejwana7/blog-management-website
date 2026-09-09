"use client";

export default function ConfirmDialog({ open, title = "Are you sure?", onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border px-4 py-2" onClick={onCancel} type="button">Cancel</button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-white" onClick={onConfirm} type="button">Confirm</button>
        </div>
      </div>
    </div>
  );
}
