import { Check, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (canShare) {
      try { await navigator.share({ title, url }); } catch { /* отказано от потребителя */ }
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,width=600,height=500');
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={share}><Share2 className="h-4 w-4" /> Сподели</Button>
      <Button variant="ghost" size="sm" onClick={copy} aria-live="polite">
        {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
        {copied ? 'Копирано' : 'Копирай линка'}
      </Button>
    </div>
  );
}
