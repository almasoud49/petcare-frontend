import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Globe, MessageSquare, X } from 'lucide-react';

interface SocialChatProps {
  whatsappNumber?: string;
  facebookPage?: string;
  messengerUsername?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function SocialChat({
  whatsappNumber = '8801712345678',
  facebookPage = 'https://facebook.com/petcare',
  messengerUsername = 'petcare',
  position = 'bottom-left',
}: SocialChatProps) {
  const [open, setOpen] = useState(false);

  const posClass =
    position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi! I have a question about your pet care services.'
  )}`;
  const messengerUrl = `https://m.me/${messengerUsername}`;

  return (
    <div className={`fixed ${posClass} z-40 flex flex-col items-end gap-3`}>
      {open && (
        <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-lg transition"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>

          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0084FF] hover:bg-[#0074E0] text-white px-4 py-3 rounded-full shadow-lg transition"
            aria-label="Chat on Messenger"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium">Messenger</span>
          </a>

          <a
            href={facebookPage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0F5FD6] text-white px-4 py-3 rounded-full shadow-lg transition"
            aria-label="Visit Facebook page"
          >
            <Globe className="h-5 w-5" />
            <span className="text-sm font-medium">Facebook</span>
          </a>
        </div>
      )}

      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat menu' : 'Open chat menu'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}