import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../../types/catalog';
import { Overlay } from '../ui/Overlay';
import { InquiryForm } from './InquiryForm';

const Ctx = createContext<{ openInquiry: (product?: Product) => void }>({ openInquiry: () => {} });

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; product?: Product }>({ open: false });
  const openInquiry = useCallback((product?: Product) => setState({ open: true, product }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <Ctx.Provider value={{ openInquiry }}>
      {children}
      <Overlay open={state.open} onClose={close} label="Запитване за продукт">
        <div className="overflow-y-auto p-5 sm:p-7">
          <p className="eyebrow">Запитване</p>
          <h2 className="mt-2 pr-10 text-xl font-semibold">{state.product ? 'Запитване за продукта' : 'Изпратете запитване'}</h2>
          <p className="mt-1.5 text-[14px] text-muted">Ще се свържем с вас с информация за цена, наличност и съвместимост.</p>
          <InquiryForm product={state.product} onDone={close} className="mt-6" />
        </div>
      </Overlay>
    </Ctx.Provider>
  );
}

export const useInquiry = () => useContext(Ctx);
