"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { getAssetUrl } from "@/utils/api";

const PAGE_SIZE = 10;

function getFullName(user) {
  return [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Unnamed user";
}

function getInitials(user) {
  return `${user?.firstname?.trim()?.[0] ?? ""}${user?.lastname?.trim()?.[0] ?? ""}`.toUpperCase() || "U";
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function StatusBadge({ isActive }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{isActive ? "Active" : "Inactive"}</span>;
}

export default function AdminUserManagement() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasLoadError, setHasLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [pendingUserId, setPendingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const detailsRequestId = useRef(0);
  const detailsTrigger = useRef(null);

  useEffect(() => {
    if (currentUser.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    let isActive = true;

    async function loadUsers() {
      setIsLoading(true);
      setError("");
      setHasLoadError(false);
      try {
        const response = await userService.getAll({ page, limit: PAGE_SIZE });
        const data = response?.data ?? {};
        if (!isActive) return;
        setUsers(Array.isArray(data.users) ? data.users : []);
        setPagination({
          currentPage: Number(data.pagination?.currentPage) || page,
          totalPages: Math.max(Number(data.pagination?.totalPages) || 1, 1),
          totalUsers: Number(data.pagination?.totalUsers) || 0,
        });
      } catch (requestError) {
        if (isActive) {
          setUsers([]);
          setHasLoadError(true);
          setError(requestError.message || "Unable to load users.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadUsers();
    return () => { isActive = false; };
  }, [currentUser.role, page, reloadKey, router]);

  useEffect(() => {
    if (!selectedUser) return undefined;

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      detailsRequestId.current += 1;
      setSelectedUser(null);
      setIsLoadingDetails(false);
      detailsTrigger.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUser]);

  async function viewUser(user, trigger) {
    const requestId = detailsRequestId.current + 1;
    detailsRequestId.current = requestId;
    detailsTrigger.current = trigger;
    setSelectedUser(user);
    setIsLoadingDetails(true);
    setError("");
    try {
      const response = await userService.getById(user.id);
      if (detailsRequestId.current === requestId) {
        setSelectedUser(response?.data ?? user);
      }
    } catch (requestError) {
      if (detailsRequestId.current === requestId) {
        setSelectedUser(null);
        setError(requestError.message || "Unable to load user information.");
      }
    } finally {
      if (detailsRequestId.current === requestId) {
        setIsLoadingDetails(false);
      }
    }
  }

  function closeUserDetails() {
    detailsRequestId.current += 1;
    setSelectedUser(null);
    setIsLoadingDetails(false);
    detailsTrigger.current?.focus();
  }

  async function toggleStatus(user) {
    if (pendingUserId !== null) return;
    if (Number(user.id) === Number(currentUser.id) && user.isActive) {
      setError("You cannot deactivate your own account.");
      return;
    }
    const nextStatus = !Boolean(user.isActive);
    setPendingUserId(user.id);
    setError("");
    setNotice("");
    try {
      const response = await userService.updateStatus(user.id, nextStatus);
      const updatedUser = response?.data ?? { ...user, isActive: nextStatus };
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...updatedUser } : item));
      setSelectedUser((current) => current?.id === user.id ? { ...current, ...updatedUser } : current);
      setNotice(response?.message || `User ${nextStatus ? "activated" : "deactivated"} successfully.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update user status.");
    } finally {
      setPendingUserId(null);
    }
  }

  if (currentUser.role !== "admin") {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800" role="alert">Admin access is required. Redirecting...</div>;
  }

  return (
    <div className="min-w-0">
      {notice ? <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status"><span className="min-w-0 break-words">{notice}</span><button aria-label="Dismiss message" className="shrink-0 font-bold" onClick={() => setNotice("")} type="button">×</button></div> : null}
      {error ? <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert"><span>{error}</span>{hasLoadError ? <button className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-red-100" onClick={() => setReloadKey((current) => current + 1)} type="button">Try again</button> : null}</div> : null}

      {isLoading ? (
        <div className="grid animate-pulse gap-4 sm:grid-cols-2"><div className="h-44 rounded-2xl bg-slate-200" /><div className="h-44 rounded-2xl bg-slate-200" /><span className="sr-only">Loading users...</span></div>
      ) : hasLoadError ? null : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-bold text-slate-800">No users found.</p></div>
      ) : (
        <>
          <div className="grid gap-4 lg:hidden">
            {users.map((user) => (
              <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={user.id}>
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0"><h2 className="break-words font-bold text-slate-900">{getFullName(user)}</h2><p className="mt-1 break-all text-sm text-slate-500">{user.email}</p></div>
                  <StatusBadge isActive={Boolean(user.isActive)} />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-violet-600">{user.role}</p>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={(event) => viewUser(user, event.currentTarget)} type="button">View</button>
                  <button className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`} disabled={pendingUserId !== null || Number(user.id) === Number(currentUser.id)} onClick={() => toggleStatus(user)} type="button">{Number(user.id) === Number(currentUser.id) ? "Current account" : pendingUserId === user.id ? "Updating..." : user.isActive ? "Deactivate" : "Activate"}</button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4" scope="col">User</th><th className="px-5 py-4" scope="col">Email</th><th className="px-5 py-4" scope="col">Role</th><th className="px-5 py-4" scope="col">Status</th><th className="px-5 py-4 text-right" scope="col">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr className="text-sm text-slate-700" key={user.id}>
                      <td className="px-5 py-4 font-bold text-slate-900">{getFullName(user)}</td>
                      <td className="px-5 py-4">{user.email}</td>
                      <td className="px-5 py-4 capitalize">{user.role}</td>
                      <td className="px-5 py-4"><StatusBadge isActive={Boolean(user.isActive)} /></td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-3"><button className="font-bold text-violet-600 hover:text-violet-800" onClick={(event) => viewUser(user, event.currentTarget)} type="button">View</button><button className={`font-bold disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive ? "text-red-600 hover:text-red-800" : "text-emerald-600 hover:text-emerald-800"}`} disabled={pendingUserId !== null || Number(user.id) === Number(currentUser.id)} onClick={() => toggleStatus(user)} type="button">{Number(user.id) === Number(currentUser.id) ? "Current account" : pendingUserId === user.id ? "Updating..." : user.isActive ? "Deactivate" : "Activate"}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!isLoading && !hasLoadError && pagination.totalPages > 1 ? (
        <nav aria-label="Users pagination" className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button>
          <p className="text-sm text-slate-500">Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalUsers} users</p>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)} type="button">Next</button>
        </nav>
      ) : null}

      {selectedUser ? (
        <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeUserDetails(); }}>
          <section aria-labelledby="user-details-title" aria-modal="true" className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7" role="dialog">
            <div className="flex min-w-0 items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">User information</p><h2 className="mt-1 break-words text-xl font-black text-slate-900" id="user-details-title">{getFullName(selectedUser)}</h2></div><button aria-label="Close user information" autoFocus className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200" onClick={closeUserDetails} type="button">×</button></div>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              {getAssetUrl(selectedUser.profilePicture) ? <span aria-label={`${getFullName(selectedUser)}'s profile image`} className="size-20 shrink-0 rounded-full bg-slate-900 bg-cover bg-center ring-4 ring-violet-100" role="img" style={{ backgroundImage: `url(${getAssetUrl(selectedUser.profilePicture)})` }} /> : <span className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-sky-500 text-xl font-black text-white ring-4 ring-violet-100" aria-hidden="true">{getInitials(selectedUser)}</span>}
              <div className="min-w-0"><p className="break-all text-sm font-semibold text-slate-700">{selectedUser.email}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold capitalize text-violet-700">{selectedUser.role}</span><StatusBadge isActive={Boolean(selectedUser.isActive)} /></div></div>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</dt><dd className="mt-1 break-words font-semibold text-slate-900">{getFullName(selectedUser)}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</dt><dd className="mt-1 break-all font-semibold text-slate-900">{selectedUser.email}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Role</dt><dd className="mt-1 font-semibold capitalize text-slate-900">{selectedUser.role}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</dt><dd className="mt-2"><StatusBadge isActive={Boolean(selectedUser.isActive)} /></dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Created Date</dt><dd className="mt-1 font-semibold text-slate-900">{formatDate(selectedUser.createAt ?? selectedUser.createdAt)}</dd></div>
            </dl>
            {isLoadingDetails ? <p className="mt-4 text-sm text-slate-500" role="status">Loading full user information...</p> : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
