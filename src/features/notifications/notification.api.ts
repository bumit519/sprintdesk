const NOTIFICATION_API =
  "https://jsonplaceholder.typicode.com/posts?_limit=5";

export interface NotificationPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function getNotifications(): Promise<
  NotificationPost[]
> {
  const response = await fetch(
    NOTIFICATION_API,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch notifications",
    );
  }

  return response.json();
}