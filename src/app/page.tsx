import { getSiteContent } from '@/lib/api';
import { RealtimeHomeWrapper } from '@/components/home/RealtimeHomeWrapper';

export default async function Home() {
  const content = await getSiteContent('home');

  return (
    <RealtimeHomeWrapper initialContent={content} />
  );
}
