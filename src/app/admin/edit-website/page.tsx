import { getSiteContent } from '@/lib/api';
import { RealtimeHomeWrapper } from '@/components/home/RealtimeHomeWrapper';
import { EditModeProvider } from '@/components/admin/EditModeProvider';

export default async function EditWebsiteAdmin() {
  const content = await getSiteContent('home');

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* 
        We use negative margins because AdminLayout adds padding, 
        but we want the website preview to take full width.
      */}
      <EditModeProvider>
        <RealtimeHomeWrapper initialContent={content} />
      </EditModeProvider>
    </div>
  );
}
