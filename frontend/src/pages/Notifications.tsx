import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../api/axios";

type Notification = {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  time: string | null;
  read: boolean;
  source: string;
  source_id: string;
};

const formatTime = (value: string | null) => {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const diff = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1000)
  );

  if (diff < 60) {
    return "Just now";
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
};

const NotificationIcon = ({
  type,
}: {
  type: Notification["type"];
}) => {
  if (type === "success") {
    return (
      <div className="p-2.5 bg-teal-50 text-[#189AB4] rounded-xl shrink-0">
        <CheckCircle2 size={20} />
      </div>
    );
  }

  if (type === "warning") {
    return (
      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
        <AlertCircle size={20} />
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0">
        <XCircle size={20} />
      </div>
    );
  }

  return (
    <div className="p-2.5 bg-blue-50 text-[#189AB4] rounded-xl shrink-0">
      <Info size={20} />
    </div>
  );
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data || []);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to load notifications from the server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Notifications
          </h1>

          <p className="text-sm text-slate-500">
            System alerts, loan updates, and operational activity
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadNotifications(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#05445E] text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Total Notifications
          </p>

          <p className="text-3xl font-bold text-[#05445E] mt-2">
            {loading ? "..." : notifications.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Unread
          </p>

          <p className="text-3xl font-bold text-[#189AB4] mt-2">
            {loading ? "..." : unreadCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Loan Alerts
          </p>

          <p className="text-3xl font-bold text-[#05445E] mt-2">
            {loading
              ? "..."
              : notifications.filter(
                  (notification) =>
                    notification.source === "loan_application" ||
                    notification.source === "loan_schedule"
                ).length}
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#189AB4]/10 text-[#189AB4] flex items-center justify-center mb-4">
              <Bell size={26} />
            </div>

            <h3 className="text-lg font-bold text-[#05445E]">
              No notifications
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              There are no recent alerts or operational updates.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 flex items-start gap-4 ${
                !notification.read ? "bg-slate-50/50" : ""
              }`}
            >
              <NotificationIcon type={notification.type} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold text-[#05445E] text-sm">
                    {notification.title}
                  </h4>

                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-[#189AB4] mt-1.5 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-0.5">
                  {notification.message}
                </p>

                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatTime(notification.time)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
