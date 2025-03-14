import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialNotifications = [
  {
    id: 1,
    user: 'Chris Tompson',
    action: 'requested review on',
    target: 'PR #42: Feature implementation',
    timestamp: '15 minutes ago',
    unread: true,
  },
  {
    id: 2,
    user: 'Emma Davis',
    action: 'shared',
    target: 'New component library',
    timestamp: '45 minutes ago',
    unread: true,
  },
  {
    id: 3,
    user: 'James Wilson',
    action: 'assigned you to',
    target: 'API integration task',
    timestamp: '4 hours ago',
    unread: false,
  },
  {
    id: 4,
    user: 'Alex Morgan',
    action: 'replied to your comment in',
    target: 'Authentication flow',
    timestamp: '12 hours ago',
    unread: false,
  },
  {
    id: 5,
    user: 'Sarah Chen',
    action: 'commented on',
    target: 'Dashboard redesign',
    timestamp: '2 days ago',
    unread: false,
  },
  {
    id: 6,
    user: 'Miky Derya',
    action: 'mentioned you in',
    target: 'Origin UI open graph image',
    timestamp: '2 weeks ago',
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width='6'
      height='6'
      fill='currentColor'
      viewBox='0 0 6 6'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <circle cx='3' cy='3' r='3' />
    </svg>
  );
}

export const NotificationButton = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.NotificationButton',
  });

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='relative'
          aria-label={t('openNotifications')}
        >
          <Bell size={16} strokeWidth={2} aria-hidden='true' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-1 w-80'>
        <div className='flex items-baseline justify-between gap-4 px-3 py-2'>
          <div className='text-sm font-semibold'>{t('notifications')}</div>
          {unreadCount > 0 && (
            <button
              className='text-xs font-medium hover:underline'
              onClick={handleMarkAllAsRead}
            >
              {t('markAllAsRead')}
            </button>
          )}
        </div>
        <div
          role='separator'
          aria-orientation='horizontal'
          className='h-px my-1 -mx-1 bg-border'
        ></div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className='px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent'
          >
            <div className='relative flex items-start pe-3'>
              <div className='flex-1 space-y-1'>
                <button
                  className='text-left text-foreground/80 after:absolute after:inset-0'
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className='font-medium text-foreground hover:underline'>
                    {notification.user}
                  </span>{' '}
                  {notification.action}{' '}
                  <span className='font-medium text-foreground hover:underline'>
                    {notification.target}
                  </span>
                  .
                </button>
                <div className='text-xs text-muted-foreground'>
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className='absolute self-center end-0'>
                  <span className='sr-only'>{t('unread')}</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
