import React, { useEffect, useState } from 'react';
import {
  Activity,
  UserPlus,
  DollarSign,
  FileCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Settings,
} from 'lucide-react';

import { api } from '../api/axios';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  branch?: string | null;
  time?: string | null;
}

const getIcon = (activity: ActivityItem) => {
  const type = String(activity.entityType || '').toLowerCase();
  const action = String(activity.action || '').toLowerCase();

  if (type.includes('write')) {
    if (action.includes('approve')) {
      return <CheckCircle2 size={18} />;
    }

    return <FileCheck size={18} />;
  }

  if (type.includes('loan')) {
    return <DollarSign size={18} />;
  }

  if (type.includes('borrower')) {
    return <UserPlus size={18} />;
  }

  if (
    action.includes('approve') ||
    action.includes('complete')
  ) {
    return <CheckCircle2 size={18} />;
  }

  if (
    action.includes('warning') ||
    action.includes('reject')
  ) {
    return <AlertCircle size={18} />;
  }

  if (action.includes('setting')) {
    return <Settings size={18} />;
  }

  return <Activity size={18} />;
};

const getIconClasses = (activity: ActivityItem) => {
  const action = String(activity.action || '').toLowerCase();

  if (
    action.includes('approve') ||
    action.includes('complete')
  ) {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (
    action.includes('reject') ||
    action.includes('warning')
  ) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-[#D4F1F4] text-[#05445E]';
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return 'Time unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const diff = Math.max(
    0,
    now.getTime() - date.getTime()
  );

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  return date.toLocaleDateString();
};

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/activity');

        setActivities(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err: any) {
        console.error(
          'Failed to load activity feed:',
          err
        );

        setError(
          err?.response?.data?.detail ||
            'Unable to load activity feed from the server.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">
          Activity Feed
        </h1>

        <p className="text-sm text-slate-500">
          Real-time log of team member actions and system events
        </p>
      </div>

      {loading && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 text-slate-500">
            <Activity
              size={20}
              className="animate-pulse"
            />
            <span>Loading activity...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-[#D4F1F4] text-[#05445E] rounded-full mb-4">
              <Activity size={28} />
            </div>

            <h3 className="text-lg font-semibold text-[#05445E]">
              No activity yet
            </h3>

            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Real system activity will appear here as users
              create, update, approve, collect, or otherwise
              process records.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex gap-4 items-start relative ${
                index < activities.length - 1
                  ? 'before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-200'
                  : ''
              }`}
            >
              <div
                className={`p-2.5 rounded-full z-10 shrink-0 ${getIconClasses(
                  activity
                )}`}
              >
                {getIcon(activity)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#05445E]">
                  {activity.user}

                  <span className="font-normal text-slate-600">
                    {' '}
                    {activity.action}
                  </span>
                </p>

                {activity.details && (
                  <p className="text-xs text-slate-600 mt-1">
                    {activity.details}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {activity.branch && (
                    <>
                      <span className="text-xs text-slate-400">
                        {activity.branch}
                      </span>

                      <span className="text-xs text-slate-300">
                        •
                      </span>
                    </>
                  )}

                  <span className="text-xs text-slate-400">
                    {formatTime(activity.time)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
